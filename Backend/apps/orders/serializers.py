from decimal import Decimal
from rest_framework import serializers
from bson import ObjectId
from .models import Order, OrderItem, Refund, OrderReport
from apps.products.serializers import ProductSerializer

class StringPrimaryKeyMixin:
    """
    Mixin to ensure ObjectId and other primary keys are converted to strings in representation.
    """
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        for field in ['id', 'user', 'product', 'order', 'master_product', 'vendor']:
            if field in representation and representation[field]:
                if isinstance(representation[field], ObjectId):
                    representation[field] = str(representation[field])
        return representation

class OrderItemSerializer(StringPrimaryKeyMixin, serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'quantity', 'price']

class OrderSerializer(StringPrimaryKeyMixin, serializers.ModelSerializer):
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

class RefundSerializer(StringPrimaryKeyMixin, serializers.ModelSerializer):
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

class VendorBulkOrderItemSerializer(StringPrimaryKeyMixin, serializers.ModelSerializer):
    product_details = ProductSerializer(source='master_product', read_only=True)
    master_product = RobustProductRelatedField(queryset=Product.objects.all())
    
    class Meta:
        model = VendorBulkOrderItem
        fields = ['id', 'master_product', 'product_details', 'quantity', 'price']

class VendorBulkOrderSerializer(StringPrimaryKeyMixin, serializers.ModelSerializer):
    items = VendorBulkOrderItemSerializer(many=True)
    vendor_email = serializers.EmailField(source='vendor.email', read_only=True)
    
    class Meta:
        model = VendorBulkOrder
        fields = ['id', 'vendor', 'vendor_email', 'status', 'total_amount', 'items', 'created_at', 'updated_at']
        read_only_fields = ['total_amount', 'vendor']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        vendor = validated_data.pop('vendor', None)
        
        # FIX: Ensure vendor has a valid primary key for Djongo/Django relationship check.
        # This addresses the "save() prohibited... due to unsaved related object 'vendor'" error.
        if vendor and not vendor.pk:
            try:
                from core.utils import get_mongo_db
                db = get_mongo_db()
                # Direct collection access is most reliable when ORM mapping fails for ObjectIds
                raw_user = db['users_user'].find_one({'email': vendor.email})
                if raw_user and '_id' in raw_user:
                    vendor.id = raw_user['_id']
            except Exception as e:
                print(f"Warning: Failed to manually recover vendor ID: {e}")

        try:
            # Calculate total amount with explicit type casting to avoid TypeError
            total_amount = Decimal('0.00')
            for item in items_data:
                price = Decimal(str(item.get('price', '0.00')))
                quantity = int(item.get('quantity', 50))
                total_amount += price * quantity
            
            # Set total and vendor explicitly
            validated_data['total_amount'] = total_amount
            if vendor:
                validated_data['vendor'] = vendor
            
            # Use an atomic-ish approach if possible, but Djongo doesn't support full transactions easily
            bulk_order = VendorBulkOrder.objects.create(**validated_data)
            
            if items_data:
                for item in items_data:
                    # Explicitly convert nested data for item creation
                    prod = item.get('master_product')
                    qty = int(item.get('quantity', 50))
                    prc = Decimal(str(item.get('price', '0.00')))
                    
                    VendorBulkOrderItem.objects.create(
                        bulk_order=bulk_order, 
                        master_product=prod,
                        quantity=qty,
                        price=prc
                    )
                
            return bulk_order
        except Exception as e:
            raise serializers.ValidationError({"error": f"Failed to finalize order: {str(e)}"})

        return representation

