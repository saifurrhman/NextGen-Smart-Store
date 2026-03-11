import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.orders.models import VendorBulkOrder

output_file = "debug_ids.txt"

with open(output_file, "w") as f:
    f.write("DEBUG ID LOG\n")
    f.write("============\n\n")

    user = get_user_model().objects.filter(role='VENDOR').first()
    if user:
        f.write(f"User Email: {user.email}\n")
        f.write(f"User id attribute: {user.id} (type: {type(user.id)})\n")
        f.write(f"User pk attribute: {user.pk} (type: {type(user.pk)})\n")
        f.write(f"User _id attribute: {getattr(user, '_id', 'N/A')}\n\n")
        
        # Test creation
        try:
            order = VendorBulkOrder.objects.create(total_amount=0, vendor=user)
            f.write(f"Order created with OBJECT: {order.id}\n")
        except Exception as e:
            f.write(f"Order creation with OBJECT error: {e}\n")
            
        try:
            # Try again with ID directly
            order2 = VendorBulkOrder.objects.create(total_amount=0, vendor_id=user.pk)
            f.write(f"Order created with ID: {order2.id}\n")
            f.write(f"Order2 vendor: {order2.vendor}\n")
        except Exception as e:
            f.write(f"Order creation with ID error: {e}\n")
    else:
        f.write("No vendor found\n")

print(f"Debug info written to {output_file}")
