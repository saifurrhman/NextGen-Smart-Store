from core.utils import get_mongo_db
import json
from bson import ObjectId

def inspect_bulk_orders():
    try:
        db = get_mongo_db()
        collection = db['orders_vendorbulkorder']
        
        print(f"Total documents: {collection.count_documents({})}")
        docs = list(collection.find().sort('_id', -1).limit(5))
        
        for doc in docs:
            # Convert ObjectId to string for printing
            doc['_id'] = str(doc['_id'])
            # Check for various vendor field names
            for field in ['vendor_id', 'vendor', 'user_id', 'user']:
                if field in doc and isinstance(doc[field], ObjectId):
                    doc[field] = str(doc[field])
                
            print(json.dumps(doc, indent=2, default=str))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_bulk_orders()
