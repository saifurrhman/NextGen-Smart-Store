from rest_framework import serializers
from .models import Delivery, DailyStatsLog
from apps.orders.models import Order
from apps.users.serializers import UserSerializer
from apps.products.models import Product

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

class DailyStatsLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyStatsLog
        fields = '__all__'

class ProductStockSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.username', read_only=True)
    status = serializers.SerializerMethodField()
    priority = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'title', 'sku', 'stock', 'min_stock', 'category_name', 'vendor_name', 'status', 'priority']

    def get_status(self, obj):
        if obj.stock <= 0:
            return "Out of Stock"
        return "Low Stock"

    def get_priority(self, obj):
        if obj.stock <= 0:
            return "Critical"
        if obj.stock <= obj.min_stock / 2:
            return "High"
        return "Medium"
