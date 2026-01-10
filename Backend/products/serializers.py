from rest_framework import serializers
from .models import Category, Product, ProductImage
from vendors.serializers import VendorRegistrationSerializer # Or a simpler VendorPublicSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'parent']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'alt_text']

class ProductListSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    category = serializers.CharField(source='category.name')
    vendor_name = serializers.CharField(source='vendor.store_name')

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'thumbnail', 'category', 'vendor_name', 'has_ar_try_on']

    def get_thumbnail(self, obj):
        img = obj.images.filter(is_primary=True).first()
        if img:
            return img.image.url
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    vendor_name = serializers.CharField(source='vendor.store_name')
    
    class Meta:
        model = Product
class ProductCreateSerializer(serializers.ModelSerializer):
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        exclude = ['vendor', 'slug', 'created_at', 'updated_at', 'is_featured']
    
    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)
        
        # Handle multiple images
        for i, image in enumerate(uploaded_images):
            ProductImage.objects.create(
                product=product, 
                image=image, 
                is_primary=(i==0) # First image is primary
            )
        
        return product
