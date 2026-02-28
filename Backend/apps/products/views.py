from rest_framework import viewsets, permissions
from .models import Product
from .serializers import ProductSerializer
from core.pagination import MongoPagination

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    pagination_class = MongoPagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user if self.request.user.is_authenticated else None)
