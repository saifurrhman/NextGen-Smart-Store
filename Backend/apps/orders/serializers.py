from rest_framework import serializers
from .models import Order, OrderItem, Refund, OrderReport
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

class OrderReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderReport
        fields = '__all__'

from .models import VendorBulkOrder, VendorBulkOrderItem

from apps.products.models import Product

class RobustProductRelatedField(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, data):
        try:
            # First try standard lookup (ObjectId or standard)
            return Product.objects.get(pk=data)
        except Exception:
            try:
                # Fallback to integer lookup for legacy catalog items
                return Product.objects.get(pk=int(str(data)))
            except Exception:
                self.fail('does_not_exist', pk_value=data)

class VendorBulkOrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='master_product', read_only=True)
    master_product = RobustProductRelatedField(queryset=Product.objects.all())
    
    class Meta:
        model = VendorBulkOrderItem
        fields = ['id', 'master_product', 'product_details', 'quantity', 'price']

class VendorBulkOrderSerializer(serializers.ModelSerializer):
    items = VendorBulkOrderItemSerializer(many=True)
    vendor_email = serializers.EmailField(source='vendor.email', read_only=True)
    
    class Meta:
        model = VendorBulkOrder
        fields = ['id', 'vendor', 'vendor_email', 'status', 'total_amount', 'items', 'created_at', 'updated_at']
        read_only_fields = ['total_amount', 'vendor']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        try:
            # Calculate total amount
            total_amount = sum(item['price'] * item['quantity'] for item in items_data)
            validated_data['total_amount'] = total_amount
            
            # Vendor is set from request context in perform_create
            bulk_order = VendorBulkOrder.objects.create(**validated_data)
            
            for item_data in items_data:
                VendorBulkOrderItem.objects.create(bulk_order=bulk_order, **item_data)
                
            return bulk_order
        except Exception as e:
            raise serializers.ValidationError({"error": f"Failed to finalize order: {str(e)}"})

