from rest_framework import serializers
from .models import VendorProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class VendorProfileSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='user.email', read_only=True)
    owner_name = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = VendorProfile
        fields = [
            'id', 'owner_email', 'owner_name', 'store_name', 'store_description', 
            'status', 'balance', 'commission_rate', 'bank_name', 'account_holder', 'account_number', 
            'product_count', 'created_at'
        ]

    def get_owner_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def get_product_count(self, obj):
        return obj.user.products.count()
