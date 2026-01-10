from rest_framework import viewsets, permissions, mixins
from .models import OrderItem
from .serializers import OrderItemSerializer
from authentication.permissions import IsVendor

class VendorOrderViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    serializer_class = OrderItemSerializer
    permission_classes = [IsVendor]

    def get_queryset(self):
        # Critical: Only return line items for this specific vendor
        return OrderItem.objects.filter(vendor__user=self.request.user).select_related('order', 'product').order_by('-order__created_at')

    def perform_update(self, serializer):
        # Allow vendor to update status (e.g. Shipped)
        serializer.save()
