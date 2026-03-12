import os
import django
from bson import ObjectId

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.orders.models import VendorBulkOrder
from core.utils import get_mongo_db

def debug_lookup(pk_str):
    print(f"DEBUG: Looking for ID: {pk_str}")
    print(f"DEBUG: Model table: {VendorBulkOrder._meta.db_table}")
    
    obj_id = ObjectId(pk_str)

    # Method 4: filter().first()
    try:
        obj = VendorBulkOrder.objects.filter(id=obj_id).first()
        print(f"Method 4 (filter ObjectId): FOUND {obj}")
    except Exception as e:
        print(f"Method 4 (filter ObjectId): FAILED {e}")

    # Method 5: filter string
    try:
        obj = VendorBulkOrder.objects.filter(id=pk_str).first()
        print(f"Method 5 (filter string): FOUND {obj}")
    except Exception as e:
        print(f"Method 5 (filter string): FAILED {e}")

    # Method 6: Get all and check IDs
    try:
        all_objs = list(VendorBulkOrder.objects.all()[:5])
        print(f"Method 6: First 5 objects in ORM: {[o.pk for o in all_objs]}")
        print(f"Method 6: Types: {[type(o.pk) for o in all_objs]}")
    except Exception as e:
        print(f"Method 6: FAILED {e}")

if __name__ == "__main__":
    target_id = "69b267fa45df195a91e2acdc"
    debug_lookup(target_id)
