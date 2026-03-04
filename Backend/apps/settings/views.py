from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import PaymentGateway, TaxRegion
from .serializers import PaymentGatewaySerializer, TaxRegionSerializer

class PaymentGatewayViewSet(viewsets.ModelViewSet):
    queryset = PaymentGateway.objects.all()
    serializer_class = PaymentGatewaySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'provider']
    filterset_fields = ['status']

class TaxRegionViewSet(viewsets.ModelViewSet):
    queryset = TaxRegion.objects.all()
    serializer_class = TaxRegionSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['region', 'tax_class']
    filterset_fields = ['status']
