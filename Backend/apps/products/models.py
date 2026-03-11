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
    price = models.DecimalField(max_digits=12, decimal_places=2)
    discount_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    discount_type = models.CharField(max_length=50, choices=[('NONE', 'No Discount'), ('PERCENTAGE', 'Percentage'), ('FIXED', 'Fixed Amount')], default='NONE')
    discount_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_tax_included = models.BooleanField(default=True)
    currency = models.CharField(max_length=10, default='PKR')
    
    # Expiration / Sales Dates
    sale_start_date = models.DateField(null=True, blank=True)
    sale_end_date = models.DateField(null=True, blank=True)
    
    # Inventory
    stock = models.IntegerField(default=0)
    min_stock = models.IntegerField(default=10)
    is_unlimited = models.BooleanField(default=False)
    stock_status = models.CharField(max_length=50, choices=[('IN_STOCK', 'In Stock'), ('OUT_OF_STOCK', 'Out of Stock'), ('ON_BACKORDER', 'On Backorder')], default='IN_STOCK')
    sku = models.CharField(max_length=100, unique=True, null=True, blank=True)
    barcode = models.CharField(max_length=100, null=True, blank=True)
    brand = models.CharField(max_length=255, null=True, blank=True)
    weight = models.CharField(max_length=50, null=True, blank=True)
    material = models.CharField(max_length=255, null=True, blank=True)
    dimensions = models.CharField(max_length=255, null=True, blank=True)
    
    # Advanced Data (Stored as JSON or Comma-separated)
    features = models.TextField(help_text="JSON string of product features", null=True, blank=True)
    colors_data = models.TextField(help_text="JSON string of selected color codes", null=True, blank=True)
    sizes_data = models.TextField(help_text="JSON string of selected sizes", null=True, blank=True)
    
    # Images
    main_image = models.ImageField(upload_to='products/main/', null=True, blank=True)
    
    # Status & Tags
    tag = models.CharField(max_length=100, blank=True, null=True)
    highlight_featured = models.BooleanField(default=False)
    
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

class ProductImage(models.Model):
    id = djongo_models.ObjectIdField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/gallery/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product.title}"

class ProductRequest(models.Model):
    id = djongo_models.ObjectIdField(primary_key=True)
    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='product_requests')
    
    # Requested Product Details
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    suggested_price = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='product_requests')
    image = models.ImageField(upload_to='product_requests/', null=True, blank=True)
    
    # Admin Review Status
    STATUS_CHOICES = (
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved & Converted'),
        ('REJECTED', 'Rejected')
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    admin_notes = models.TextField(blank=True, null=True, help_text="Notes from admin regarding approval/rejection.")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request: {self.title} by {self.vendor.email}"
