from rest_framework import generics, filters
from .models import Product, Category
from .serializers import ProductListSerializer, ProductDetailSerializer, ProductCreateSerializer
from rest_framework.permissions import AllowAny

class ProductPublicListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name', 'ai_tags']
    ordering_fields = ['price', 'created_at']

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = ProductListSerializer # Simplify for now, or make CategorySerializer
    permission_classes = [AllowAny]

from rest_framework.permissions import IsAuthenticated

class VendorProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically assign the vendor from the logged-in user
        # Assumes request.user.vendor_profile exists
        serializer.save(vendor=self.request.user.vendor_profile)
