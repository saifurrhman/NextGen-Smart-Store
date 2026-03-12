from core.utils import get_mongo_db
import json
from bson import ObjectId

def repair_orders():
    try:
        db = get_mongo_db()
        users_coll = db['users_user']
        orders_coll = db['orders_vendorbulkorder']
        
        # 1. Find a vendor
        vendor_doc = users_coll.find_one({'role': 'VENDOR'})
        if not vendor_doc:
            vendor_doc = users_coll.find_one({'role': 'SELLER'})
        
        if not vendor_doc:
            # Fallback: check any user
            vendor_doc = users_coll.find_one({})
            
        if not vendor_doc:
            print("No users found in system.")
            return

        vendor_id = vendor_doc['_id']
        vendor_email = vendor_doc.get('email', 'Unknown')
        print(f"Using vendor: {vendor_email} (ID: {vendor_id})")

        # 2. Find orders with null vendor_id or missing vendor field
        query = {'$or': [{'vendor_id': None}, {'vendor_id': {'$exists': False}}]}
        null_orders = list(orders_coll.find(query))
        
        print(f"Found {len(null_orders)} orders with missing vendor.")
        
        for doc in null_orders:
            order_id = doc['_id']
            print(f"Repairing order {order_id}...")
            
            # Djongo usually stores FK as 'vendor_id'
            result = orders_coll.update_one(
                {'_id': order_id},
                {'$set': {'vendor_id': vendor_id}}
            )
            print(f"Order {order_id} update result: {result.modified_count} modified.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    repair_orders()
