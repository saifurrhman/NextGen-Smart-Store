import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings')
django.setup()

from apps.products.models import Product
from apps.attributes.models import Attribute
from apps.categories.models import Category
from bson import ObjectId

print("Testing Categories...")
try:
    print(f"Categories count: {Category.objects.count()}")
except Exception as e:
    print(f"Categories error: {e}")

print("\nTesting Attributes...")
try:
    print(f"Attributes count: {Attribute.objects.count()}")
except Exception as e:
    print(f"Attributes error: {e}")

print("\nTesting Products...")
try:
    print(f"Products count: {Product.objects.count()}")
    product = Product.objects.first()
    if product:
        print(f"First product title: {product.title}")
        print(f"First product id: {product.id} (type: {type(product.id)})")
        
        # Test the lookup that the view does
        print(f"\nTesting lookup for ID {product.id}...")
        try:
            p2 = Product.objects.get(id=ObjectId(str(product.id)))
            print(f"Lookup by ObjectId(str) SUCCESS: {p2.title}")
        except Exception as e:
            print(f"Lookup by ObjectId(str) ERROR: {e}")
            
        try:
            p3 = Product.objects.get(id=str(product.id))
            print(f"Lookup by string SUCCESS: {p3.title}")
        except Exception as e:
            print(f"Lookup by string ERROR: {e}")
except Exception as e:
    print(f"Products error: {e}")
