import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings')
django.setup()

from apps.orders.models import VendorBulkOrder
from django.contrib.auth import get_user_model
User = get_user_model()

# Get a vendor
vendor = User.objects.filter(role='VENDOR').first()
if not vendor:
    print("No vendor found to test with")
    exit()

print(f"Testing with vendor: {vendor.email} (ID: {vendor.pk})")

try:
    # Attempt creation using vendor_id directly
    order = VendorBulkOrder(total_amount=100)
    order.vendor_id = vendor.pk
    order.save()
    print(f"Success! Order created with ID: {order.pk}")
    
    # Reload and check relationship
    reloaded = VendorBulkOrder.objects.get(pk=order.pk)
    print(f"Reloaded vendor: {reloaded.vendor}")
    if reloaded.vendor:
        print("Vendor relationship is INTACT")
    else:
        print("Vendor relationship is MISSING")
        
except Exception as e:
    print(f"Error: {e}")
