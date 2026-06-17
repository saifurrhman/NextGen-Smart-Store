import os
import sys
import django
import traceback

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from apps.products.models import Product
from apps.orders.serializers import VendorBulkOrderSerializer

def test_creation():
    User = get_user_model()
    # Find a vendor user
    vendor = User.objects.filter(role='VENDOR').first()
    if not vendor:
        print("Error: No vendor user found in database.")
        return

    # Find a product
    product = Product.objects.filter(is_active=True).first()
    if not product:
        print("Error: No active product found in database.")
        return

    print(f"Testing with Vendor: {vendor.email} (id: {vendor.id})")
    print(f"Testing with Product: {product.title} (id: {product.id}, price: {product.price})")

    # Construct the data sent by the frontend
    order_data = {
        'items': [{
            'master_product': str(product.id),
            'quantity': 50,
            'price': float(product.price)
        }]
    }

    # Serialize and create
    serializer = VendorBulkOrderSerializer(data=order_data)
    if not serializer.is_valid():
        print("Serializer errors:", serializer.errors)
        return

    try:
        # Save by passing vendor, mimicking perform_create
        order = serializer.save(vendor=vendor)
        print("Success! Bulk order created with ID:", order.id)
    except Exception as e:
        print("------------------- TRACEBACK -------------------")
        traceback.print_exc()
        print("-------------------------------------------------")
        print("Exception str:", str(e))

if __name__ == '__main__':
    test_creation()
