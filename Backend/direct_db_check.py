import pymongo
from bson import ObjectId
import json

MONGO_URI = "mongodb+srv://nextgensmatstore:6ssyse0XcJEhDlsu@nextgensmatstore.9m3dit1.mongodb.net/?appName=nextgensmatstore"
DB_NAME = "nextgen_smart_store"

def check():
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DB_NAME]
    
    print(f"Collections: {db.list_collection_names()}")
    
    # Try to find a vendor
    user_coll = db['users_user']
    vendor = user_coll.find_one({'role': 'VENDOR'})
    
    if vendor:
        print("Vendor Document:")
        # Convert ObjectId for printing
        v_copy = vendor.copy()
        if '_id' in v_copy:
            v_copy['_id_type'] = str(type(v_copy['_id']))
            v_copy['_id'] = str(v_copy['_id'])
        print(json.dumps(v_copy, indent=2, default=str))
    else:
        print("No vendor found in users_user")

    # Check a product too
    prod_coll = db['products_product']
    product = prod_coll.find_one()
    if product:
        print("\nProduct Document:")
        p_copy = product.copy()
        if '_id' in p_copy:
            p_copy['_id_type'] = str(type(p_copy['_id']))
            p_copy['_id'] = str(p_copy['_id'])
        print(json.dumps(p_copy, indent=2, default=str))

if __name__ == "__main__":
    check()
