from rest_framework import viewsets, permissions
from .models import Attribute
from .serializers import AttributeSerializer
from core.pagination import MongoPagination

class AttributeViewSet(viewsets.ModelViewSet):
    queryset = Attribute.objects.all().order_by('-created_at')
    serializer_class = AttributeSerializer
    pagination_class = MongoPagination
    permission_classes = [permissions.AllowAny]
