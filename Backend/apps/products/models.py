from django.db import models
from django.conf import settings
from apps.categories.models import Category
from apps.attributes.models import Attribute
from djongo import models as djongo_models

class Product(models.Model):
    id = djongo_models.ObjectIdField(primary_key=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_type = models.CharField(max_length=50, choices=[('NONE', 'No Discount'), ('PERCENTAGE', 'Percentage'), ('FIXED', 'Fixed Amount')], default='NONE')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_tax_included = models.BooleanField(default=True)
    
    # Inventory
    stock = models.IntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True, null=True, blank=True)
    barcode = models.CharField(max_length=100, null=True, blank=True)
    
    # Relations
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    attributes = models.ManyToManyField(Attribute, blank=True, related_name='products')
    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        from django.utils.text import slugify
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
