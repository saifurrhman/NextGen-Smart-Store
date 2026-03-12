import os
import django
from bson import ObjectId

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.orders.models import VendorBulkOrder
from core.utils import get_mongo_db

def inspect_collection():
    db = get_mongo_db()
    coll = db['orders_vendorbulkorder']
    
    total = coll.count_documents({})
    print(f"Total documents in 'orders_vendorbulkorder': {total}")
    
    # Check for integer IDs
    int_ids = list(coll.find({'_id': {'$type': 'number'}}).limit(5))
    print(f"Found {coll.count_documents({'_id': {'$type': 'number'}})} documents with integer _id.")
    if int_ids:
        print(f"Sample int IDs: {[d['_id'] for d in int_ids]}")
        
    # Check for ObjectID IDs
    obj_ids = list(coll.find({'_id': {'$type': 'objectId'}}).limit(5))
    print(f"Found {coll.count_documents({'_id': {'$type': 'objectId'}})} documents with ObjectID _id.")
    if obj_ids:
        print(f"Sample ObjectID IDs: {[str(d['_id']) for d in obj_ids]}")

    # Specific check for the failing ID
    target_id = "69b267fa45df195a91e2acdc"
    target_doc = coll.find_one({'_id': ObjectId(target_id)})
    if target_doc:
        print(f"Target document {target_id} EXISTS in PyMongo.")
        # Try to find it via ORM with various field names
        print(f"Attempting ORM lookup for {target_id}...")
        try:
            o1 = VendorBulkOrder.objects.filter(id=ObjectId(target_id)).first()
            print(f"  ORM lookup by id=ObjectId: {'FOUND' if o1 else 'NOT FOUND'}")
        except Exception as e:
            print(f"  ORM lookup by id=ObjectId ERROR: {e}")
            
        try:
            o2 = VendorBulkOrder.objects.filter(pk=target_id).first()
            print(f"  ORM lookup by pk=string: {'FOUND' if o2 else 'NOT FOUND'}")
        except Exception as e:
            print(f"  ORM lookup by pk=string ERROR: {e}")

if __name__ == "__main__":
    inspect_collection()
