import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings')
django.setup()

from apps.categories.models import Category
from bson import ObjectId

cat_id_str = "69b11afe2b86a541829a887d"

print("\nTesting Django lookup with ObjectId instance (pk):")
try:
    cat = Category.objects.get(pk=ObjectId(cat_id_str))
    print("SUCCESS with ObjectId (pk):", getattr(cat, 'name', 'unknown'))
except Exception as e:
    print("FAILED with ObjectId (pk):", e)

print("\nTesting Django lookup with string ID (pk):")
try:
    cat = Category.objects.get(pk=cat_id_str)
    print("SUCCESS with string ID (pk):", getattr(cat, 'name', 'unknown'))
except Exception as e:
    print("FAILED with string ID (pk):", e)

print("\nTesting Django lookup with string ID (_id):")
try:
    cat = Category.objects.get(_id=cat_id_str)
    print("SUCCESS with string ID (_id):", getattr(cat, 'name', 'unknown'))
except Exception as e:
    print("FAILED with string ID (_id):", e)
