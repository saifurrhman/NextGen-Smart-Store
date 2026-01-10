from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Product
from .vendor_serializers import VendorProductSerializer
from authentication.permissions import IsVendor, IsVendorOwner

class VendorProductViewSet(viewsets.ModelViewSet):
    serializer_class = VendorProductSerializer
    permission_classes = [IsVendor] # Add IsVendorOwner for object level if needed
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        # Only return products belonging to the logged-in vendor
        return Product.objects.filter(vendor__user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Auto-assign the vendor instance
        serializer.save(vendor=self.request.user.vendor_profile)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Verify ownership explicitly just in case
        if instance.vendor.user != request.user:
             return Response({"error": "You do not own this product"}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
