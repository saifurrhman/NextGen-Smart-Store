from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    performance = serializers.SerializerMethodField()
    clearance = serializers.SerializerMethodField()
    tier = serializers.SerializerMethodField()
    uid = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['uid', 'id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 'address', 'role', 'is_active', 'date_joined', 'performance', 'clearance', 'tier', 'date_of_birth', 'bio', 'avatar']
        read_only_fields = ['id', 'uid', 'date_joined']

    def get_uid(self, obj):
        """Return MongoDB _id as string — always unique, never null."""
        try:
            pk = obj.pk
            if pk is not None:
                return str(pk)
        except Exception:
            pass
        try:
            return str(obj._id)
        except Exception:
            pass
        return obj.email  # Fallback: email is always unique

    def get_performance(self, obj):
        if obj.role != 'DELIVERY': return 'N/A'
        from apps.operations.models import Delivery
        total = Delivery.objects.filter(delivery_boy=obj).count()
        if total == 0: return "5.00"
        delivered = Delivery.objects.filter(delivery_boy=obj, status='delivered').count()
        return f"{(delivered / total) * 5:.2f}"

    def get_clearance(self, obj):
        if obj.role == 'DELIVERY': return "Level 5"
        if obj.role == 'SUPER_ADMIN': return "Level 10"
        return "Level 1"

    def get_tier(self, obj):
        if obj.role != 'DELIVERY': return 'N/A'
        from apps.operations.models import Delivery
        total = Delivery.objects.filter(delivery_boy=obj).count()
        if total >= 20: return "Elite"
        if total >= 5: return "Pro"
        return "Standard"

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
