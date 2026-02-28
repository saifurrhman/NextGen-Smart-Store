from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'description', 
            'price', 'discount_price', 'discount_type', 'discount_value', 'is_tax_included',
            'stock', 'sku', 'barcode',
            'category', 'category_name', 'attributes', 'vendor', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'vendor']
