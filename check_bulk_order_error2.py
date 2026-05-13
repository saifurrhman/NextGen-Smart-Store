import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.orders.views import VendorBulkOrderViewSet
from django.test import RequestFactory
from django.contrib.auth import get_user_model

def get_admin_user():
    User = get_user_model()
    return User.objects.filter(is_superuser=True).first()

if __name__ == '__main__':
    user = get_admin_user()
    if not user:
        print("No superuser found.")
        sys.exit(1)
        
    factory = RequestFactory()
    request = factory.get('/api/v1/orders/bulk-orders/')
    request.user = user

    view = VendorBulkOrderViewSet.as_view({'get': 'list'})
    
    print(f"Testing with user: {user.email}")
    response = view(request)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 500:
        import json
        print(json.dumps(response.data, indent=2))
        
