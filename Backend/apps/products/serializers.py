from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    # Accept the string ID directly to map to category_id
    category = serializers.CharField(source='category_id', required=False, allow_null=True)

    def get_category_name(self, obj):
        try:
            from core.utils import get_mongo_db
            from bson.objectid import ObjectId
            if not obj.category_id:
                return None
            db = get_mongo_db()
            cat = db['categories_category'].find_one({'_id': ObjectId(str(obj.category_id))})
            return cat.get('name') if cat else None
        except Exception:
            return None
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'description', 
            'price', 'discount_price', 'discount_type', 'discount_value', 'is_tax_included',
            'currency', 'sale_start_date', 'sale_end_date',
            'stock', 'sku', 'barcode', 'min_stock', 'is_unlimited', 'stock_status',
            'brand', 'weight', 'material', 'dimensions', 'features', 'colors_data', 'sizes_data',
            'main_image', 'images', 'tag', 'highlight_featured',
            'category', 'category_name', 'attributes', 'vendor', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'vendor']

from .models import ProductRequest

class ProductRequestSerializer(serializers.ModelSerializer):
    vendor_email = serializers.EmailField(source='vendor.email', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = ProductRequest
        fields = [
            'id', 'vendor', 'vendor_email', 'title', 'description', 
            'suggested_price', 'category', 'category_name', 'image', 
            'status', 'admin_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'vendor', 'status', 'created_at', 'updated_at']
