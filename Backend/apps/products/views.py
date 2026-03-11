from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product, ProductImage, ProductRequest
from .serializers import ProductSerializer, ProductImageSerializer, ProductRequestSerializer
from core.utils import get_mongo_db


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]

        try:
            # Try parsing as integer for legacy entries created before ObjectId migration
            return queryset.get(**{self.lookup_field: int(lookup_value)})
        except ValueError:
            pass
        except Exception:
            pass

        try:
            from bson import ObjectId
            # Try direct ObjectId lookup if valid
            if ObjectId.is_valid(lookup_value):
                try:
                    return queryset.get(id=ObjectId(lookup_value))
                except:
                    pass
            
            # Fallback to standard lookup
            return queryset.get(**{self.lookup_field: lookup_value})
        except Exception as e:
            from django.http import Http404
            raise Http404(f"Product not found: {str(e)}")

    def list(self, request, *args, **kwargs):
        """
        Override list() to use raw PyMongo, bypassing Djongo's broken
        .order_by() + pagination that causes 500 errors.
        """
        try:
            db = get_mongo_db()
            collection = db['products_product']

            # Build filter from query params
            query = {}
            
            # Only show vendor's products or admin products (vendor=None) based on scope
            vendor_id = request.query_params.get('vendor', '')
            if vendor_id:
                if vendor_id == 'none' or vendor_id == 'null':
                    query['vendor_id'] = None
                else:
                    query['vendor_id'] = vendor_id
            
            search = request.query_params.get('search', '').strip()
            if search:
                query['$or'] = [
                    {'title': {'$regex': search, '$options': 'i'}},
                    {'sku': {'$regex': search, '$options': 'i'}},
                    {'tag': {'$regex': search, '$options': 'i'}},
                ]

            is_active = request.query_params.get('is_active', '')
            if is_active.lower() == 'true':
                query['is_active'] = True
            elif is_active.lower() == 'false':
                query['is_active'] = False

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
                'total_pages': (total + page_size - 1) // page_size,
                'results': results,
            })
        except Exception as e:
            # Fallback: try plain ORM without order_by
            try:
                qs = Product.objects.all()
                serializer = self.get_serializer(qs, many=True)
                return Response({'count': qs.count(), 'results': serializer.data})
            except Exception as e2:
                return Response({'count': 0, 'results': [], 'error': str(e2)})

    @action(detail=False, methods=['get'], url_path='master-catalog')
    def master_catalog(self, request):
        """Returns products created by Admin (vendor=None) for Wholesale."""
        try:
            db = get_mongo_db()
            collection = db['products_product']
            
            # Use raw Mongo to avoid Djongo ORM 'IS NULL' decoding bugs
            query = {'vendor_id': None, 'is_active': True}
            
            search = request.query_params.get('search', '').strip()
            if search:
                query['$or'] = [
                    {'title': {'$regex': search, '$options': 'i'}},
                    {'sku': {'$regex': search, '$options': 'i'}},
                ]

            docs = list(collection.find(query).sort('_id', -1))
            
            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)
            
            # Manually add category_name if missing
            cat_ids = list(set([doc.get('category_id') for doc in results if doc.get('category_id')]))
            if cat_ids:
                from bson import ObjectId
                cat_map = {}
                cat_docs = list(db['categories_category'].find({'_id': {'$in': [ObjectId(str(cid)) for cid in cat_ids]}}))
                for c in cat_docs:
                    cat_map[str(c['_id'])] = c.get('name')
                
                for doc in results:
                    cid = doc.get('category_id')
                    if cid and str(cid) in cat_map:
                        doc['category_name'] = cat_map[str(cid)]

            return Response({'results': results})
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    def create(self, request, *args, **kwargs):
        gallery_images = request.FILES.getlist('gallery')
        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save(vendor=self.request.user if self.request.user.is_authenticated else None)

        # Save gallery images
        for img in gallery_images:
            ProductImage.objects.create(product=product, image=img)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        gallery_images = request.FILES.getlist('gallery')
        instance = self.get_object()

        # Fix Djongo bug where DecimalFields fetch Decimal128 objects which crash on save
        from bson.decimal128 import Decimal128
        for field in ['price', 'discount_price', 'discount_value']:
            val = getattr(instance, field, None)
            if isinstance(val, Decimal128):
                setattr(instance, field, val.to_decimal())

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        if gallery_images:
            for img in gallery_images:
                ProductImage.objects.create(product=product, image=img)

        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user if self.request.user.is_authenticated else None)


class ProductRequestViewSet(viewsets.ModelViewSet):
    queryset = ProductRequest.objects.all()
    serializer_class = ProductRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ProductRequest.objects.all()
        return ProductRequest.objects.filter(vendor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        obj = self.get_object()
        if obj.status == 'APPROVED':
            return Response({'detail': 'Request already approved'}, status=400)
        
        # Logic to convert to Master Product
        product = Product.objects.create(
            title=obj.title,
            description=obj.description,
            price=obj.suggested_price,
            category=obj.category,
            main_image=obj.image,
            vendor=None, # Master Product
            is_active=True,
            stock=0 # Start with 0 master stock
        )
        
        obj.status = 'APPROVED'
        obj.admin_notes = request.data.get('notes', 'Approved by Admin')
        obj.save()
        
        return Response({'status': 'Approved', 'product_id': str(product.id)})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        obj = self.get_object()
        obj.status = 'REJECTED'
        obj.admin_notes = request.data.get('notes', 'Rejected by Admin')
        obj.save()
        return Response({'status': 'Rejected'})
