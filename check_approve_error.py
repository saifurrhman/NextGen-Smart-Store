import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

def test_approve():
    User = get_user_model()
    # Let's bypass is_superuser lookup crash by picking an admin from email
    admin = User.objects.filter(email='saifriaz34@gmail.com').first()
    
    client = APIClient()
    client.force_authenticate(user=admin)
    
    res = client.get('/api/v1/orders/bulk-orders/')
    print("GET status:", res.status_code)
    
    docs = res.data.get('results', [])
    for doc in docs:
        if doc.get('status') == 'pending':
            oid = doc['id']
            print("Approving:", oid)
            r = client.post(f'/api/v1/orders/bulk-orders/{oid}/approve/')
            print(f"Approve Status: {r.status_code}")
            import pprint
            pprint.pprint(r.data)
            break

if __name__ == '__main__':
    test_approve()
