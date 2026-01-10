from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    product_image = serializers.SerializerMethodField()
    vendor_name = serializers.CharField(source='vendor.store_name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'vendor_name', 'quantity', 'price', 'subtotal', 'status']

    def get_product_image(self, obj):
        img = obj.product.images.filter(is_primary=True).first()
        if img:
            return img.image.url
        return None

class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'full_name', 'email', 'phone', 'address', 'city', 'zip_code', 'payment_method', 'total_amount', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        order = Order.objects.create(customer=user, **validated_data)
        
        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            OrderItem.objects.create(
                order=order,
                product=product,
                vendor=product.vendor, # Link item to vendor logic
                quantity=item['quantity'],
                price=product.price
            )
        return order

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
