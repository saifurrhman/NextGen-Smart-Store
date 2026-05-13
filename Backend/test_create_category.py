import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.categories.serializers import CategorySerializer
import traceback

data = {
    'name': 'shoes',
    'slug': 'shoes',
    'description': '',
    'is_active': True
}
s = CategorySerializer(data=data)
try:
    print("Is valid:", s.is_valid())
    if s.is_valid():
        s.save()
        print("Saved successfully!")
    else:
        print("Errors:", s.errors)
except Exception as e:
    print("CRASHED!")
    traceback.print_exc()
