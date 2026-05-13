import pymongo
from bson import ObjectId
import json
import os
from dotenv import load_dotenv

MONGO_URI = "mongodb+srv://nextgensmatstore:6ssyse0XcJEhDlsu@nextgensmatstore.9m3dit1.mongodb.net/?appName=nextgensmatstore"
DB_NAME = "nextgen_smart_store"

def check():
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DB_NAME]
    
    print(f"Collections present: {db.list_collection_names()}")
    
    orders = db['orders_vendorbulkorder']
    items = db['orders_vendorbulkitem']
    
    order_count = orders.count_documents({})
    item_count = items.count_documents({})
    
    print(f"Order Count: {order_count}")
    print(f"Item Count: {item_count}")
    
    if order_count > 0:
        print("\nLast 3 Orders Raw:")
        for doc in orders.find().sort('_id', -1).limit(3):
            doc['_id'] = str(doc['_id'])
            # Convert any ObjectId fields to string for printing
            for k, v in doc.items():
                if isinstance(v, ObjectId):
                    doc[k] = str(v)
            print(json.dumps(doc, indent=2, default=str))
            
    if item_count > 0:
        print("\nLast 3 Items Raw:")
        for doc in items.find().sort('_id', -1).limit(3):
            doc['_id'] = str(doc['_id'])
            for k, v in doc.items():
                if isinstance(v, ObjectId):
                    doc[k] = str(v)
            print(json.dumps(doc, indent=2, default=str))

if __name__ == "__main__":
    check()
