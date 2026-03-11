from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import action
from .models import Order, Refund, OrderReport, VendorBulkOrder, VendorBulkOrderItem
from .serializers import OrderSerializer, RefundSerializer, OrderReportSerializer, VendorBulkOrderSerializer
from rest_framework.response import Response
from apps.products.models import Product, ProductImage
from core.utils import get_mongo_db
from core.permissions import IsAdminRole
from bson import ObjectId


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

            # Payment status filter
            payment_status = request.query_params.get('payment_status', '')
            if payment_status:
                query['payment_status'] = payment_status

            # Search
            search = request.query_params.get('search', '').strip()
            if search:
                query['$or'] = [
                    {'customer_name': {'$regex': search, '$options': 'i'}},
                    {'customer_email': {'$regex': search, '$options': 'i'}},
                ]

            # Pagination
            try:
                page = int(request.query_params.get('page', 1))
                page_size = int(request.query_params.get('page_size', 20))
            except (ValueError, TypeError):
                page = 1
                page_size = 20

            skip = (page - 1) * page_size
            total = collection.count_documents(query)
            docs = list(collection.find(query).sort('_id', -1).skip(skip).limit(page_size))

            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)

            return Response({
                'count': total,
                'page': page,
                'page_size': page_size,
                'results': results,
            })
        except Exception as e:
            # Fallback: plain ORM without ordering
            try:
                qs = Order.objects.all()
                serializer = self.get_serializer(qs, many=True)
                return Response({'count': qs.count(), 'results': serializer.data})
            except Exception as e2:
                return Response({'count': 0, 'results': [], 'error': str(e2)})


class RefundListView(generics.ListAPIView):
    queryset = Refund.objects.all()
    serializer_class = RefundSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        """Use raw PyMongo to avoid Djongo order_by crash."""
        try:
            db = get_mongo_db()
            collection = db['orders_refund']
            docs = list(collection.find({}).sort('_id', -1).limit(100))
            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)
            return Response({'count': len(results), 'results': results})
        except Exception as e:
            return Response({'count': 0, 'results': [], 'error': str(e)})


class OrderReportViewSet(viewsets.ModelViewSet):
    queryset = OrderReport.objects.all()
    serializer_class = OrderReportSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        """Use raw PyMongo to avoid Djongo order_by crash."""
        try:
            db = get_mongo_db()
            collection = db['orders_orderreport']
            docs = list(collection.find({}).sort('_id', -1).limit(100))
            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)
            return Response({'count': len(results), 'results': results})
        except Exception as e:
            return Response({'count': 0, 'results': [], 'error': str(e)})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            db = get_mongo_db()
            result = db['orders_orderreport'].delete_one({'_id': ObjectId(str(instance.id))})
            if result.deleted_count == 0:
                return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VendorBulkOrderViewSet(viewsets.ModelViewSet):
    queryset = VendorBulkOrder.objects.all()
    serializer_class = VendorBulkOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'role', '') in ('SUPER_ADMIN', 'SUB_ADMIN', 'ADMIN'):
            return VendorBulkOrder.objects.all()
        return VendorBulkOrder.objects.filter(vendor=user)

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminRole])
    def approve(self, request, pk=None):
        order = self.get_object()
        if order.status == 'shipped':
            return Response({'detail': 'Order already fulfillment'}, status=400)
        
        # Critical Logic: Allocate inventory to Vendor
        for item in order.items.all():
            m_product = item.master_product
            
            # Check if vendor already has a product linked to this master product
            # For simplicity, we create a NEW product entry for each bulk order fulfillment
            # Or we could find existing one and update stock. 
            # Users often want to sell the same item multiple times or manage it as one entry.
            # Let's search by title + vendor as a semi-unique check.
            existing_prod = Product.objects.filter(vendor=order.vendor, title=m_product.title).first()
            
            if existing_prod:
                existing_prod.stock += item.quantity
                existing_prod.save()
            else:
                # Create duplicate entry
                new_prod = Product.objects.create(
                    title=m_product.title,
                    description=m_product.description,
                    price=m_product.price, # Default to master price
                    category=m_product.category,
                    main_image=m_product.main_image,
                    stock=item.quantity,
                    is_active=True,
                    vendor=order.vendor,
                    sku=f"{m_product.sku}-{order.vendor.id}"[:100] if m_product.sku else None
                )
                
                # Copy gallery images if possible
                for img_obj in m_product.images.all():
                    ProductImage.objects.create(product=new_prod, image=img_obj.image)

        order.status = 'shipped'
        order.save()
        
        return Response({'status': 'Approved & Inventory Allocated'})
