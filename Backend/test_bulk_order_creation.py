import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.orders.models import VendorBulkOrder, VendorBulkOrderItem
from apps.products.models import Product
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

def diagnose():
    user = User.objects.filter(role='VENDOR').first()
    if not user:
        print("No vendor found")
        return

    print(f"Diagnosing Vendor: {user.email}")
    print(f"  - Initial .pk: {user.pk}")
    
    product = Product.objects.first()
    if not product:
        print("No product found")
        return

    print(f"Product: {product.title}, ID: {product.id}")

    # Test via Serializer to verify the fix
    from apps.orders.serializers import VendorBulkOrderSerializer
    
    data = {
        'items': [
            {
                'master_product': product.id,
                'quantity': 50,
                'price': '2.00'
            }
        ],
        'status': 'pending'
    }
    
    print("Attempting creation via VendorBulkOrderSerializer...")
    serializer = VendorBulkOrderSerializer(data=data)
    if serializer.is_valid():
        try:
            bulk_order = serializer.save(vendor=user)
            print(f"Bulk Order Created Successfully via Serializer: {bulk_order.id}")
            # Cleanup
            bulk_order.delete()
            print("Cleanup successful")
        except Exception as e:
            print(f"Serializer save failed: {e}")
            import traceback
            traceback.print_exc()
    else:
        print(f"Serializer validation failed: {serializer.errors}")

if __name__ == "__main__":
    diagnose()
