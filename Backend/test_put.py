import os
import sys
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings')
django.setup()

from apps.products.models import Product
from apps.products.serializers import ProductSerializer

p = None
for prod in Product.objects.all():
    p = prod
    break

print('Product ID:', p.id)

serializer = ProductSerializer(p, data={'title': "Test Title Updated By Script", 'category': '69b11afe2b86a541829a887d', 'price': '89.99'}, partial=True)
if serializer.is_valid():
    print('Valid! category_id assigned:', serializer.validated_data.get('category_id'))
    try:
        serializer.save()
        print('Saved successfully')
    except Exception as e:
        print('Save error:', e)
else:
    print('Errors:', serializer.errors)
