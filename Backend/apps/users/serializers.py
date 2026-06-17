from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    performance = serializers.SerializerMethodField()
    clearance = serializers.SerializerMethodField()
    tier = serializers.SerializerMethodField()
    uid = serializers.SerializerMethodField()
    vendor_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'uid', 'id', 'email', 'username', 'first_name', 'last_name', 
            'phone_number', 'address', 'role', 'department', 'is_active', 'date_joined', 
            'performance', 'clearance', 'tier', 'date_of_birth', 'bio', 
            'avatar', 'vendor_profile'
        ]
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
        role_upper = str(getattr(obj, 'role', '')).upper()
        if role_upper == 'DELIVERY': return "Level 5"
        if role_upper in ('SUPER_ADMIN', 'SUPERADMIN'): return "Level 10"
        return "Level 1"

    def get_tier(self, obj):
        if obj.role != 'DELIVERY': return 'N/A'
        from apps.operations.models import Delivery
        total = Delivery.objects.filter(delivery_boy=obj).count()
        if total >= 20: return "Elite"
        if total >= 5: return "Pro"
        return "Standard"

    def get_vendor_profile(self, obj):
        if obj.role != 'VENDOR':
            return None
        try:
            profile = obj.vendor_profile
            return {
                'id': str(profile.pk),
                'store_name': profile.store_name,
                'store_description': profile.store_description,
                'status': profile.status,
                'balance': float(profile.balance),
                'commission_rate': float(profile.commission_rate) if profile.commission_rate else None,
                'bank_name': profile.bank_name,
                'account_holder': profile.account_holder,
                'account_number': profile.account_number,
            }
        except Exception:
            return None

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
