from rest_framework import viewsets, permissions, status, mixins
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from products.models import Product
from orders.models import OrderItem

from products.vendor_serializers import VendorProductSerializer
from orders.serializers import OrderItemSerializer

from authentication.permissions import IsVendor

class VendorProductViewSet(viewsets.ModelViewSet):
    serializer_class = VendorProductSerializer
    permission_classes = [IsVendor]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Product.objects.filter(vendor__user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user.vendor_profile)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.vendor.user != request.user:
             return Response({"error": "You do not own this product"}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class VendorOrderViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    serializer_class = OrderItemSerializer
    permission_classes = [IsVendor]

    def get_queryset(self):
        return OrderItem.objects.filter(vendor__user=self.request.user).select_related('order', 'product').order_by('-order__created_at')
