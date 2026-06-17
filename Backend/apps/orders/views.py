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
            user = request.user
            is_admin = user.is_staff or str(getattr(user, 'role', '')).upper() in ('SUPER_ADMIN', 'SUPERADMIN', 'SUB_ADMIN', 'SUBADMIN', 'ADMIN')
            if not is_admin:
                query['user_id'] = user.id

            results = list(collection.find(query).sort('created_at', -1).limit(100))
            
            # Format results for frontend
            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(results)

            return Response(results)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def destroy(self, request, *args, **kwargs):
        try:
            from core.utils import get_mongo_db
            from bson import ObjectId
            db = get_mongo_db()
            
            pk = kwargs.get('pk')
            query_ids = [pk]
            try:
                query_ids.append(ObjectId(pk))
            except Exception:
                pass
                
            # Delete order items first
            db['orders_orderitem'].delete_many({
                '$or': [
                    {'order_id': {'$in': query_ids}},
                    {'order_id': pk},
                    {'order_id': str(pk)}
                ]
            })
            
            # Delete the order itself
            result = db['orders_order'].delete_one({
                '$or': [
                    {'_id': {'$in': query_ids}},
                    {'id': {'$in': query_ids}},
                    {'id': pk},
                    {'id': str(pk)}
                ]
            })
            
            if result.deleted_count == 0:
                return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
                
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RefundViewSet(viewsets.ModelViewSet):
    queryset = Refund.objects.all()
    serializer_class = RefundSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        is_admin = user.is_staff or str(getattr(user, 'role', '')).upper() in ('SUPER_ADMIN', 'SUPERADMIN', 'SUB_ADMIN', 'SUBADMIN', 'ADMIN')
        if is_admin:
            return Refund.objects.all()
        return Refund.objects.filter(order__user=user)


class OrderReportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrderReport.objects.all()
    serializer_class = OrderReportSerializer
    permission_classes = [IsAdminRole]


class VendorBulkOrderViewSet(viewsets.ModelViewSet):
    queryset = VendorBulkOrder.objects.all()
    serializer_class = VendorBulkOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        is_admin = user.is_authenticated and (user.is_staff or str(getattr(user, 'role', '')).upper() in ('SUPER_ADMIN', 'SUPERADMIN', 'SUB_ADMIN', 'SUBADMIN', 'ADMIN'))
        if is_admin:
            return VendorBulkOrder.objects.all().order_by('-created_at')
        return VendorBulkOrder.objects.filter(vendor=user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        try:
            from core.utils import get_mongo_db, sanitize_mongo_doc
            db = get_mongo_db()
            
            user = request.user
            is_admin = user.is_authenticated and (user.is_staff or str(getattr(user, 'role', '')).upper() in ('SUPER_ADMIN', 'SUPERADMIN', 'SUB_ADMIN', 'SUBADMIN', 'ADMIN'))
            
            query = {}
            if not is_admin:
                uid = None
                if hasattr(user, '_id') and user._id:
                    uid = user._id
                elif hasattr(user, 'id') and user.id:
                    uid = user.id
                elif hasattr(user, 'pk') and user.pk:
                    uid = user.pk
                
                from bson import ObjectId
                if isinstance(uid, str):
                    uid = ObjectId(uid)
                query['vendor_id'] = uid

            # Fetch bulk orders
            orders_cursor = db['orders_vendorbulkorder'].find(query).sort('created_at', -1)
            orders = list(orders_cursor)
            
            # For each order, fetch items and populate details
            for order in orders:
                order_id = order.get('_id') or order.get('id')
                
                # Fetch vendor email if missing
                vendor_id = order.get('vendor_id')
                vendor_email = ""
                if vendor_id:
                    from bson import ObjectId
                    if isinstance(vendor_id, str):
                        vendor_id = ObjectId(vendor_id)
                    vendor_doc = db['users_user'].find_one({'_id': vendor_id})
                    if vendor_doc:
                        vendor_email = vendor_doc.get('email', '')
                order['vendor_email'] = vendor_email
                
                # Fetch bulk order items matching either the ObjectId or the custom id/string id
                order_mongo_id = order.get('_id')
                order_custom_id = order.get('id')
                
                items_query = {'$or': [
                    {'bulk_order_id': order_mongo_id},
                    {'bulk_order_id': order_custom_id}
                ]}
                
                # If order_custom_id is an integer, also check string representation of it
                if isinstance(order_custom_id, int):
                    items_query['$or'].append({'bulk_order_id': str(order_custom_id)})
                elif isinstance(order_custom_id, str) and order_custom_id.isdigit():
                    items_query['$or'].append({'bulk_order_id': int(order_custom_id)})
                    
                items_cursor = db['orders_vendorbulkorderitem'].find(items_query)
                items = list(items_cursor)
                
                # For each item, fetch product details
                for item in items:
                    prod_id = item.get('master_product_id')
                    product_details = {}
                    if prod_id:
                        prod_queries = [{'_id': prod_id}, {'id': prod_id}]
                        if isinstance(prod_id, str):
                            if prod_id.isdigit():
                                prod_queries.append({'id': int(prod_id)})
                            try:
                                from bson import ObjectId
                                prod_queries.append({'_id': ObjectId(prod_id)})
                            except Exception:
                                pass
                        elif isinstance(prod_id, int):
                            prod_queries.append({'id': str(prod_id)})
                            
                        prod_doc = db['products_product'].find_one({'$or': prod_queries})
                        if prod_doc:
                            product_details = {
                                'title': prod_doc.get('title', ''),
                                'main_image': prod_doc.get('main_image', '')
                            }
                    item['product_details'] = product_details
                
                order['items'] = sanitize_mongo_doc(items)
                
            results = sanitize_mongo_doc(orders)
            
            return Response({
                'count': len(results),
                'next': None,
                'previous': None,
                'results': results
            })
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, '_wrapped'):
            user = user._wrapped
        serializer.save(vendor=user)

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
            is_admin = request.user.is_staff or str(getattr(request.user, 'role', '')).upper() in ('SUPER_ADMIN', 'SUPERADMIN', 'SUB_ADMIN', 'SUBADMIN', 'ADMIN')
            if not is_admin and order.vendor != request.user:
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
                    
                    from bson.decimal128 import Decimal128
                    price_val = m_product.price
                    if isinstance(price_val, Decimal128):
                        price_val = price_val.to_decimal()
                    else:
                        try:
                            from decimal import Decimal
                            price_val = Decimal(str(price_val or '0.00'))
                        except Exception:
                            price_val = 0.0

                    Product.objects.create(
                        title=m_product.title,
                        slug=unique_slug,
                        description=m_product.description,
                        price=price_val,
                        main_image=m_product.main_image,
                        stock=item.quantity,
                        is_active=True,
                        vendor_id=vendor.id,
                        sku=f"{m_product.sku}-{v_id_str[:8]}"[:100] if m_product.sku else None
                    )

            # 3. Finalize order status
            from bson.decimal128 import Decimal128
            if isinstance(order.total_amount, Decimal128):
                order.total_amount = order.total_amount.to_decimal()
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

    def destroy(self, request, *args, **kwargs):
        try:
            from core.utils import get_mongo_db
            from bson import ObjectId
            db = get_mongo_db()
            
            pk = kwargs.get('pk')
            query_ids = [pk]
            try:
                query_ids.append(ObjectId(pk))
            except Exception:
                pass
                
            # Delete bulk order items
            db['orders_vendorbulkorderitem'].delete_many({
                '$or': [
                    {'bulk_order_id': {'$in': query_ids}},
                    {'bulk_order_id': pk},
                    {'bulk_order_id': str(pk)}
                ]
            })
            
            # Delete bulk order
            result = db['orders_vendorbulkorder'].delete_one({
                '$or': [
                    {'_id': {'$in': query_ids}},
                    {'id': {'$in': query_ids}},
                    {'id': pk},
                    {'id': str(pk)}
                ]
            })
            
            if result.deleted_count == 0:
                return Response({'detail': 'Bulk order not found.'}, status=status.HTTP_404_NOT_FOUND)
                
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
