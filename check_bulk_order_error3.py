import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

def get_admin_user():
    User = get_user_model()
    # Djongo crashes on is_superuser=True sometimes. Let's find using email.
    return User.objects.filter(email='saifriaz34@gmail.com').first()

if __name__ == '__main__':
    user = get_admin_user()
    if not user:
        print("User not found.")
        sys.exit(1)
        
    client = APIClient()
    client.force_authenticate(user=user)
    
    response = client.get('/api/v1/orders/bulk-orders/')
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 500:
        import pprint
        # Response might be raw HTML if it's a Django unhandled 500 crash
        if getattr(response, 'data', None):
            pprint.pprint(response.data)
        else:
            # Print first 1000 characters of the raw content
            print(response.content.decode('utf-8')[:1000])
