from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import VendorProfile

User = get_user_model()

class VendorRegistrationSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(required=True)
    description = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone', 'address', 'store_name', 'description']

    def create(self, validated_data):
        store_name = validated_data.pop('store_name')
        description = validated_data.pop('description', '')
        password = validated_data.pop('password')

        # Create User with VENDOR role
        user = User.objects.create_user(**validated_data, password=password)
        user.role = 'VENDOR'
        user.save()

        # Create Vendor Profile
        VendorProfile.objects.create(
            user=user,
            store_name=store_name,
            description=description
        )
        return user
