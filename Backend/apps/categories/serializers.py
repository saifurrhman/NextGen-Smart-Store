from rest_framework import serializers
from django.utils.text import slugify
from django.conf import settings
import pymongo
from .models import Category


def slug_exists_in_mongo(slug):
    """Check if a slug already exists using ORM."""
    return Category.objects.filter(slug=slug).exists()


class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source='parent.name', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'image', 'is_active', 'created_at', 'parent', 'parent_name']
        read_only_fields = ['created_at', 'parent_name']
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True}
        }

    def _generate_unique_slug(self, name, base_slug=None):
        slug = slugify(base_slug or name)
        if not slug:
            slug = 'category'
        unique_slug = slug
        counter = 1
        while slug_exists_in_mongo(unique_slug):
            unique_slug = f"{slug}-{counter}"
            counter += 1
        return unique_slug

    def create(self, validated_data):
        name = validated_data.get('name', '')
        provided_slug = validated_data.get('slug', '').strip()
        validated_data['slug'] = self._generate_unique_slug(name, base_slug=provided_slug if provided_slug else None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
