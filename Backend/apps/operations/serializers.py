from rest_framework import serializers
from .models import Delivery
from apps.orders.models import Order
from apps.users.serializers import UserSerializer

class DeliverySerializer(serializers.ModelSerializer):
    delivery_boy_details = UserSerializer(source='delivery_boy', read_only=True)
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), source='order')
    destination_address = serializers.SerializerMethodField()

    class Meta:
        model = Delivery
        fields = ['id', 'order', 'order_id', 'delivery_boy', 'delivery_boy_details', 'status', 'tracking_id', 'latitude', 'longitude', 'destination_address', 'estimated_delivery', 'actual_delivery', 'created_at', 'updated_at']

    def get_destination_address(self, obj):
        # Fallback to order user address if specific shipping fields are missing
        if obj.order and obj.order.user:
            return obj.order.user.address
        return "Standard Protocol Vector"
