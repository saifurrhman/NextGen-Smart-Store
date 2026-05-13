import pymongo
from bson import ObjectId
import json

MONGO_URI = "mongodb+srv://nextgensmatstore:6ssyse0XcJEhDlsu@nextgensmatstore.9m3dit1.mongodb.net/?appName=nextgensmatstore"
DB_NAME = "nextgen_smart_store"

def check():
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DB_NAME]
    
    coll = db['orders_vendorbulkorder']
    order = coll.find_one()
    
    if order:
        print("Bulk Order Document raw:")
        res = {}
        for k, v in order.items():
            res[k] = str(v) + " (" + str(type(v)) + ")"
        print(json.dumps(res, indent=2))
    else:
        print("No bulk order found")

if __name__ == "__main__":
    check()
