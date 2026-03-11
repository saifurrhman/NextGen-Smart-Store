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

    def list(self, request, *args, **kwargs):
        """Use raw PyMongo to avoid timeouts and Djongo relationship crashes."""
        try:
            db = get_mongo_db()
            collection = db['orders_vendorbulkorder']
            
            user = request.user
            query = {}
            if not (user.is_staff or getattr(user, 'role', '') in ('SUPER_ADMIN', 'SUB_ADMIN', 'ADMIN')):
                query['vendor_id'] = user.id

            # Simple pagination
            limit = 50
            docs = list(collection.find(query).sort('_id', -1).limit(limit))
            
            # Fetch all items for these orders in one go if possible, or per order for simplicity
            item_coll = db['orders_vendorbulkitem']
            
            # Enrich with vendor emails and items manually to avoid ORM overhead
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            results = []
            for doc in docs:
                # Sanitize ID
                order_id_obj = doc.pop('_id')
                doc['id'] = str(order_id_obj)
                
                # Fetch vendor email
                v_id = doc.get('vendor_id')
                email = "Missing Vendor"
                if v_id:
                    try:
                        v_obj = User.objects.get(pk=v_id)
                        email = v_obj.email
                    except:
                        pass
                doc['vendor_email'] = email
                
                # Fetch Items
                items_docs = list(item_coll.find({'bulk_order_id': order_id_obj}))
                enriched_items = []
                for i_doc in items_docs:
                    i_doc['id'] = str(i_doc.pop('_id'))
                    # Potentially fetch product title here if product_details is missing
                    if 'master_product_id' in i_doc and not i_doc.get('product_details'):
                        try:
                            prod_coll = db['products_product']
                            p_doc = prod_coll.find_one({'_id': i_doc['master_product_id']})
                            if p_doc:
                                i_doc['product_details'] = {'title': p_doc.get('title')}
                        except:
                            pass
                    
                    # Convert Decimals
                    if 'price' in i_doc:
                        i_doc['price'] = str(i_doc['price'])
                    enriched_items.append(i_doc)
                
                doc['items'] = enriched_items

                # Format amounts and dates for JSON
                if 'total_amount' in doc:
                    doc['total_amount'] = str(doc['total_amount'])
                if 'created_at' in doc:
                    doc['created_at'] = doc['created_at'].isoformat() if hasattr(doc['created_at'], 'isoformat') else str(doc['created_at'])
                
                results.append(doc)

            return Response({
                'count': len(results),
                'results': results,
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

    def get_robust_object(self, pk):
        """
        Attempts to find a VendorBulkOrder by pk, handling both ObjectId and integer lookups.
        """
        try:
            # Try standard lookup
            return VendorBulkOrder.objects.get(pk=pk)
        except Exception:
            try:
                from bson import ObjectId
                # Explicitly try ObjectId conversion for hex strings
                return VendorBulkOrder.objects.get(pk=ObjectId(str(pk)))
            except Exception:
                try:
                    # Fallback to integer lookup for legacy items
                    return VendorBulkOrder.objects.get(pk=int(str(pk)))
                except Exception:
                    return None

    @action(detail=True, methods=['post'], permission_classes=[IsAdminRole])
    def approve(self, request, pk=None):
        try:
            order = self.get_robust_object(pk)
            if not order:
                return Response({'detail': f'Bulk order {pk} not found.'}, status=404)

            if order.status == 'shipped':
                return Response({'detail': 'Order already fulfillment'}, status=400)
            
            # Robust Vendor Lookup: Bypass order.vendor property to avoid Djongo lookup crashes
            from django.contrib.auth import get_user_model
            User = get_user_model()
            vendor = None
            
            # Try getting raw ID field
            vendor_id = getattr(order, 'vendor_id', None)
            if vendor_id:
                try:
                    # Try lookup by actual PK (ObjectId)
                    vendor = User.objects.get(pk=vendor_id)
                except Exception:
                    try:
                        # Fallback for integer IDs
                        vendor = User.objects.get(pk=int(str(vendor_id)))
                    except Exception:
                        pass

            if not vendor:
                return Response({'error': f'Cannot approve: order {pk} has no valid vendor (Raw ID: {vendor_id}).'}, status=400)
            
            # Critical Logic: Allocate inventory to Vendor
            for item in order.items.all():
                m_product = item.master_product
                if not m_product:
                    continue

                # Search by title + vendor as a semi-unique check.
                existing_prod = Product.objects.filter(vendor=vendor, title=m_product.title).first()
                
                if existing_prod:
                    existing_prod.stock += item.quantity
                    existing_prod.save()
                else:
                    # Create duplicate entry with vendor-unique slug and sku
                    from django.utils.text import slugify
                    vendor_id_str = str(vendor.id)
                    base_slug = slugify(m_product.title)
                    unique_slug = f"{base_slug}-{vendor_id_str[:8]}"
                    
                    new_prod = Product.objects.create(
                        title=m_product.title,
                        slug=unique_slug,
                        description=m_product.description,
                        price=m_product.price, 
                        category=m_product.category,
                        main_image=m_product.main_image,
                        stock=item.quantity,
                        is_active=True,
                        vendor=vendor,
                        sku=f"{m_product.sku}-{vendor_id_str[:8]}"[:100] if m_product.sku else None
                    )
                    
                    # Copy gallery images
                    for img_obj in m_product.images.all():
                        ProductImage.objects.create(product=new_prod, image=img_obj.image)

            order.status = 'shipped'
            order.save()
            return Response({'status': 'Approved & Inventory Allocated'})
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(error_details)
            return Response({'error': f'Approval failed: {str(e)}'}, status=500)
