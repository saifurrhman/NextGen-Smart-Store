from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from core.pagination import MongoPagination

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users. 
    Can be filtered by role using query params.
    """
    queryset = User.objects.all().order_by('-date_joined')
    pagination_class = MongoPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        role = self.request.query_params.get('role')
        if role == 'DELIVERY':
            from .serializers import DeliveryBoySerializer
            return DeliveryBoySerializer
        return UserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset
