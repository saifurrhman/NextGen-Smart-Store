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
        
        # Safely unwrap SimpleLazyObject
        if hasattr(vendor, '_wrapped'):
            vendor = vendor._wrapped

        # Retrieve vendor ID reliably
        vendor_id = None
        if vendor:
            if hasattr(vendor, '_id') and vendor._id:
                vendor_id = vendor._id
            elif hasattr(vendor, 'id') and vendor.id:
                vendor_id = vendor.id
            elif hasattr(vendor, 'pk') and vendor.pk:
                vendor_id = vendor.pk
                
        # If vendor_id is still missing, lookup in DB by email
        if not vendor_id and vendor and hasattr(vendor, 'email') and vendor.email:
            try:
                from core.utils import get_mongo_db
                db = get_mongo_db()
                raw_user = db['users_user'].find_one({'email': vendor.email})
                if raw_user:
                    vendor_id = raw_user['_id']
            except Exception:
                pass

        if not vendor_id:
            raise serializers.ValidationError({"error": "Failed to identify vendor user."})

        from bson import ObjectId
        # Ensure vendor_id is an ObjectId instance
        if isinstance(vendor_id, str):
            vendor_id = ObjectId(vendor_id)

        try:
            # Calculate total amount
            total_amount = Decimal('0.00')
            for item in items_data:
                price = Decimal(str(item.get('price', '0.00')))
                quantity = int(item.get('quantity', 50))
                total_amount += price * quantity

            from core.utils import get_mongo_db
            from datetime import datetime
            db = get_mongo_db()

            # Self-heal database: update any existing documents where 'id' is missing or null
            # to prevent E11000 duplicate key error on index keyPattern: {'id': 1}
            try:
                for doc in db['orders_vendorbulkorder'].find({'id': None}):
                    db['orders_vendorbulkorder'].update_one({'_id': doc['_id']}, {'$set': {'id': doc['_id']}})
                for doc in db['orders_vendorbulkorderitem'].find({'id': None}):
                    db['orders_vendorbulkorderitem'].update_one({'_id': doc['_id']}, {'$set': {'id': doc['_id']}})
            except Exception:
                pass
            
            # Generate new ObjectId for the bulk order
            order_id = ObjectId()
            
            # Insert bulk order doc directly
            now = datetime.now()
            order_doc = {
                '_id': order_id,
                'id': order_id, # MUST match the _id and satisfy Djongo/Mongo index constraint
                'vendor_id': vendor_id,
                'status': 'pending',
                'total_amount': str(total_amount), # Djongo stores DecimalField as string
                'created_at': now,
                'updated_at': now
            }
            db['orders_vendorbulkorder'].insert_one(order_doc)

            # Insert bulk order items docs directly
            if items_data:
                item_docs = []
                for item in items_data:
                    prod = item.get('master_product')
                    prod_id = None
                    if prod:
                        if hasattr(prod, '_id') and prod._id:
                            prod_id = prod._id
                        elif hasattr(prod, 'id') and prod.id:
                            prod_id = prod.id
                        elif hasattr(prod, 'pk') and prod.pk:
                            prod_id = prod.pk
                            
                    if isinstance(prod_id, str):
                        prod_id = ObjectId(prod_id)
                        
                    qty = int(item.get('quantity', 50))
                    prc = str(Decimal(str(item.get('price', '0.00'))))
                    
                    item_id = ObjectId()
                    item_docs.append({
                        '_id': item_id,
                        'id': item_id, # MUST match the _id and satisfy Djongo/Mongo index constraint
                        'bulk_order_id': order_id,
                        'master_product_id': prod_id,
                        'quantity': qty,
                        'price': prc
                    })
                if item_docs:
                    db['orders_vendorbulkorderitem'].insert_many(item_docs)

            # Return a constructed VendorBulkOrder instance so DRF serializer is happy
            return VendorBulkOrder(
                id=order_id,
                vendor=vendor,
                status='pending',
                total_amount=total_amount,
                created_at=now,
                updated_at=now
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise serializers.ValidationError({"error": f"Failed to finalize order: {str(e)}"})

