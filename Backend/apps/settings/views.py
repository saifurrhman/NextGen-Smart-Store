from rest_framework import viewsets
from .models import PaymentGateway, TaxRegion
from .serializers import PaymentGatewaySerializer, TaxRegionSerializer

class PaymentGatewayViewSet(viewsets.ModelViewSet):
    queryset = PaymentGateway.objects.all()
    serializer_class = PaymentGatewaySerializer

class TaxRegionViewSet(viewsets.ModelViewSet):
    queryset = TaxRegion.objects.all()
    serializer_class = TaxRegionSerializer
