from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'description', 
            'price', 'discount_price', 'discount_type', 'discount_value', 'is_tax_included',
            'currency', 'sale_start_date', 'sale_end_date',
            'stock', 'sku', 'barcode', 'min_stock', 'is_unlimited', 'stock_status',
            'main_image', 'images', 'tag', 'highlight_featured',
            'category', 'category_name', 'attributes', 'vendor', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'vendor']
