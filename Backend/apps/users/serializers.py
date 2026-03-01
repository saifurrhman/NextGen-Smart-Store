from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 'address', 'role', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'is_active']

class DeliveryBoySerializer(UserSerializer):
    stats = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['stats']

    def get_stats(self, obj):
        from apps.operations.models import Delivery
        return {
            'total': Delivery.objects.filter(delivery_boy=obj).count(),
            'delivered': Delivery.objects.filter(delivery_boy=obj, status='delivered').count(),
            'pending': Delivery.objects.filter(delivery_boy=obj).exclude(status='delivered').count()
        }
