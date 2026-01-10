from django.db import models
from django.conf import settings
from django.utils.text import slugify

# Helper for 3D/AR file paths
def ar_model_path(instance, filename):
    return f'products/ar_models/{instance.slug}/{filename}'

def product_image_path(instance, filename):
    return f'products/images/{instance.product.slug}/{filename}'

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    icon = models.ImageField(upload_to='categories/icons/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')
    
    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Product(models.Model):
    vendor = models.ForeignKey('vendors.VendorProfile', on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)
    
    # Feature Flags
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    # Advanced Tech Fields (AR/3D/AI)
    has_ar_try_on = models.BooleanField(default=False)
    ar_model_file = models.FileField(upload_to=ar_model_path, blank=True, null=True, help_text="Upload .glb or .gltf file for 3D/AR View")
    ai_tags = models.TextField(blank=True, help_text="Comma separated tags for AI recommendations")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.vendor.store_name}-{self.name}")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=product_image_path)
    is_primary = models.BooleanField(default=False)
    alt_text = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"Image for {self.product.name}"

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
