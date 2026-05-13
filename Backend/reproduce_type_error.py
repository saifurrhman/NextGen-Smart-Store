import os
import django
import json
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.orders.serializers import VendorBulkOrderSerializer
from apps.users.models import User
from apps.products.models import Product

def reproduce():
    user = User.objects.filter(role='VENDOR').first()
    product = Product.objects.first()
    
    data = {
        'items': [{
            'master_product': str(product.id),
            'quantity': 50,
            'price': str(product.price)
        }],
        'status': 'pending'
    }
    
    print(f"Testing with User: {user.email}")
    serializer = VendorBulkOrderSerializer(data=data)
    if serializer.is_valid():
        try:
            print("Serializer is valid. Calling save()...")
            bulk_order = serializer.save(vendor=user)
            print(f"Created Bulk Order: {bulk_order.id}")
            
            print("Verifying JSON serialization...")
            serialized_data = VendorBulkOrderSerializer(bulk_order).data
            
            # The real test for the bug the user reported:
            try:
                json_str = json.dumps(serialized_data)
                print("SUCCESS: JSON serialization works!")
                print(f"Result: {json_str[:100]}...")
            except TypeError as te:
                print(f"STILL FAILING: {te}")
                
            # Cleanup
            bulk_order.delete()
        except Exception as e:
            print(f"CAUGHT ERROR: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
    else:
        print(f"Serializer errors: {serializer.errors}")

if __name__ == "__main__":
    reproduce()
