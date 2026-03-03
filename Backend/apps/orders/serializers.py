from rest_framework import serializers
from .models import Order, OrderItem, Refund
from apps.products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'customer_email', 'status', 'total_amount', 'items', 'created_at', 'updated_at']
        read_only_fields = ['total_amount']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate total amount
        total_amount = sum(item['price'] * item['quantity'] for item in items_data)
        validated_data['total_amount'] = total_amount
        
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
            
        return order

class RefundSerializer(serializers.ModelSerializer):
    order_id = serializers.CharField(source='order.id', read_only=True)
    customer_email = serializers.EmailField(source='order.user.email', read_only=True)
    
    class Meta:
        model = Refund
        fields = ['id', 'order', 'order_id', 'customer_email', 'amount', 'reason', 'status', 'created_at', 'updated_at']
