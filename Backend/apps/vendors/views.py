from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import VendorProfile
from .serializers import VendorProfileSerializer
from core.pagination import MongoPagination

class VendorViewSet(viewsets.ModelViewSet):
    queryset = VendorProfile.objects.all().order_by('-created_at')
    serializer_class = VendorProfileSerializer
    pagination_class = MongoPagination
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        vendor = self.get_object()
        vendor.status = 'active'
        vendor.save()
        
        # Also ensure user role is VENDOR (though it should be already)
        user = vendor.user
        user.role = 'VENDOR'
        user.save()
        
        return Response({'status': 'vendor approved'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        vendor = self.get_object()
        vendor.status = 'rejected'
        vendor.save()
        return Response({'status': 'vendor rejected'}, status=status.HTTP_200_OK)
