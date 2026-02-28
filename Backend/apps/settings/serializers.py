from rest_framework import serializers
from .models import PaymentGateway, TaxRegion

class PaymentGatewaySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentGateway
        fields = '__all__'

class TaxRegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRegion
        fields = '__all__'
