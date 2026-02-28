from rest_framework import serializers
from .models import Transaction, Payout
from django.contrib.auth import get_user_model

User = get_user_model()

class TransactionSerializer(serializers.ModelSerializer):
    order_id = serializers.CharField(source='order.id', read_only=True)
    customer_email = serializers.EmailField(source='order.user.email', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'order', 'order_id', 'customer_email', 'amount', 'status', 'payment_method', 'created_at']

class PayoutSerializer(serializers.ModelSerializer):
    vendor_email = serializers.EmailField(source='vendor.email', read_only=True)
    vendor_name = serializers.SerializerMethodField()
    store_name = serializers.SerializerMethodField()

    class Meta:
        model = Payout
        fields = ['id', 'vendor', 'vendor_email', 'vendor_name', 'store_name', 'amount', 'status', 'bank_info', 'created_at']

    def get_vendor_name(self, obj):
        return f"{obj.vendor.first_name} {obj.vendor.last_name}".strip() or obj.vendor.username

    def get_store_name(self, obj):
        try:
            return obj.vendor.vendor_profile.store_name
        except:
            return "No Store"
