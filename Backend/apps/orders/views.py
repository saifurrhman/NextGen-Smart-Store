from datetime import datetime
from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import action
from .models import Order, Refund, OrderReport, VendorBulkOrder, VendorBulkOrderItem
from .serializers import OrderSerializer, RefundSerializer, OrderReportSerializer, VendorBulkOrderSerializer
from rest_framework.response import Response
from apps.products.models import Product, ProductImage
from core.utils import get_mongo_db
from core.permissions import IsAdminRole
from bson import ObjectId
from django.core.mail import send_mail, EmailMessage
from django.http import FileResponse
from .utils import generate_bulk_order_invoice_pdf
import io


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        """
        Use raw PyMongo to avoid Djongo order_by() + filter crashes and timeouts.
        """
        try:
            db = get_mongo_db()
            collection = db['orders_order']

            query = {}
            # Status filter
            order_status = request.query_params.get('status', '')
            if order_status:
                query['status'] = order_status

            # User filter
            if not request.user.is_staff:
                query['user_id'] = request.user.id

            results = list(collection.find(query).sort('created_at', -1).limit(100))
            
            # Format results for frontend
            for res in results:
                res['id'] = str(res['_id'])
                del res['_id']

            return Response(results)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class RefundViewSet(viewsets.ModelViewSet):
    queryset = Refund.objects.all()
    serializer_class = RefundSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Refund.objects.all()
        return Refund.objects.filter(order__user=self.request.user)


class OrderReportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrderReport.objects.all()
    serializer_class = OrderReportSerializer
    permission_classes = [IsAdminRole]


class VendorBulkOrderViewSet(viewsets.ModelViewSet):
    queryset = VendorBulkOrder.objects.all()
    serializer_class = VendorBulkOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return VendorBulkOrder.objects.all().order_by('-created_at')
        return VendorBulkOrder.objects.filter(vendor=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

    def to_representation(self, instance):
        """
        Standard to_representation is slow for large bulk lists.
        """
        return super().to_representation(instance)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def download_invoice(self, request, pk=None):
        """
        Generates and returns the PDF invoice for a bulk order.
        Available to both Admins and the Vendor who owns the order.
        """
        try:
            order = self.get_object()
            # Security check: Only admin or the specific vendor can download
            if not request.user.is_staff and order.vendor != request.user:
                return Response({'error': 'Unauthorized to download this invoice.'}, status=403)
            
            serializer = self.get_serializer(order)
            pdf_bytes = generate_bulk_order_invoice_pdf(serializer.data)
            
            response = FileResponse(
                io.BytesIO(pdf_bytes), 
                content_type='application/pdf'
            )
            response['Content-Disposition'] = f'attachment; filename="Invoice_Bulk_{str(order.id)[:8]}.pdf"'
            return response
        except Exception as e:
            return Response({'error': f"Failed to generate PDF: {str(e)}"}, status=500)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminRole])
    def approve(self, request, pk=None):
        try:
            order = self.get_object()
            if order.status == 'shipped':
                return Response({'error': 'Order already approved'}, status=400)
            
            vendor = order.vendor
            if not vendor:
                return Response({'error': 'No vendor associated with this order'}, status=400)

            # 1. Load items reliably
            items = list(order.items.all())
            if not items:
                try:
                    from core.utils import get_mongo_db
                    db = get_mongo_db()
                    item_docs = list(db['orders_vendorbulkorderitem'].find({'bulk_order_id': order.id}))
                    for idoc in item_docs:
                        m_item = VendorBulkOrderItem(
                            quantity=idoc.get('quantity', 0),
                            price=idoc.get('price', 0)
                        )
                        mp_id = idoc.get('master_product_id')
                        if mp_id:
                            try:
                                m_item.master_product = Product.objects.get(pk=mp_id)
                            except Exception: pass
                        items.append(m_item)
                except Exception as e:
                    print(f"PyMongo fetch error: {e}")

            if not items:
                return Response({'error': 'Order has no items'}, status=400)

            # 2. Allocate inventory
            for item in items:
                m_product = item.master_product
                if not m_product: continue

                existing_prod = Product.objects.filter(vendor_id=vendor.id, title=m_product.title).first()
                if existing_prod:
                    try:
                        db = get_mongo_db()
                        db['products_product'].update_one(
                            {'_id': existing_prod.id},
                            {'$inc': {'stock': item.quantity}}
                        )
                    except Exception as e:
                        print(f"Stock update failed: {e}")
                else:
                    from django.utils.text import slugify
                    v_id_str = str(vendor.id)
                    unique_slug = f"{slugify(m_product.title)}-{v_id_str[:8]}"
                    
                    Product.objects.create(
                        title=m_product.title,
                        slug=unique_slug,
                        description=m_product.description,
                        price=float(m_product.price or 0.0),
                        main_image=m_product.main_image,
                        stock=item.quantity,
                        is_active=True,
                        vendor_id=vendor.id,
                        sku=f"{m_product.sku}-{v_id_str[:8]}"[:100] if m_product.sku else None
                    )

            # 3. Finalize order status
            order.status = 'shipped'
            order.save()

            # 4. Notify & Email PDF
            try:
                from apps.notifications.models import Notification
                Notification.objects.create(
                    recipient=vendor,
                    title="Bulk Order Approved",
                    message=f"Order #{str(order.id)[:8]} has been approved and stock allocated.",
                    type='ORDER_UPDATE'
                )

                serializer = self.get_serializer(order)
                pdf_content = generate_bulk_order_invoice_pdf(serializer.data)

                msg = EmailMessage(
                    subject=f"Bulk Order #{str(order.id)[:8].upper()} Approved",
                    body=f"Hello,\n\nYour order #{str(order.id)[:8].upper()} is approved. PDF Bill is attached.",
                    from_email='admin@nextgen.com',
                    to=[vendor.email]
                )
                msg.attach(f'Invoice_{str(order.id)[:8]}.pdf', pdf_content, 'application/pdf')
                msg.send()
            except Exception as e:
                print(f"Alert failed: {e}")

            return Response({'status': 'Approved'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)
