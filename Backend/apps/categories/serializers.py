from rest_framework import serializers
from django.utils.text import slugify
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'image', 'is_active', 'created_at']
        read_only_fields = ['created_at']
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True}
        }

    def _generate_unique_slug(self, name, base_slug=None):
        slug = slugify(base_slug or name)
        unique_slug = slug
        counter = 1
        while Category.objects.filter(slug=unique_slug).exists():
            unique_slug = f"{slug}-{counter}"
            counter += 1
        return unique_slug

    def create(self, validated_data):
        # Always auto-generate a unique slug based on name or provided slug
        name = validated_data.get('name', '')
        provided_slug = validated_data.get('slug', '').strip()
        validated_data['slug'] = self._generate_unique_slug(name, base_slug=provided_slug if provided_slug else None)
        return super().create(validated_data)
