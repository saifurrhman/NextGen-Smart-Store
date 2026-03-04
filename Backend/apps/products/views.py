from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Product, ProductImage
from .serializers import ProductSerializer, ProductImageSerializer
from core.utils import get_mongo_db


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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
                qs = list(Product.objects.all())
                serializer = self.get_serializer(qs, many=True)
                return Response({'count': len(qs), 'results': serializer.data})
            except Exception as e2:
                return Response({'count': 0, 'results': [], 'error': str(e2)})

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
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        if gallery_images:
            for img in gallery_images:
                ProductImage.objects.create(product=product, image=img)

        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user if self.request.user.is_authenticated else None)
