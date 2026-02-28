from rest_framework import serializers
from .models import Attribute

class AttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = ['id', 'name', 'slug', 'terms', 'is_active', 'created_at']
