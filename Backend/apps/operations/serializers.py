from rest_framework import serializers
from .models import Delivery
from apps.orders.models import Order
from apps.users.serializers import UserSerializer

class DeliverySerializer(serializers.ModelSerializer):
    delivery_boy_details = UserSerializer(source='delivery_boy', read_only=True)
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), source='order')

    class Meta:
        model = Delivery
        fields = '__all__'
