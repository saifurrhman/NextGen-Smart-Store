import pymongo
from bson import ObjectId
import json

MONGO_URI = "mongodb+srv://nextgensmatstore:6ssyse0XcJEhDlsu@nextgensmatstore.9m3dit1.mongodb.net/?appName=nextgensmatstore"
DB_NAME = "nextgen_smart_store"

def check():
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DB_NAME]
    
    user_coll = db['users_user']
    vendor = user_coll.find_one({'role': 'VENDOR'})
    
    if vendor:
        print("Vendor Document raw:")
        res = {}
        for k, v in vendor.items():
            res[k] = str(v) + " (" + str(type(v)) + ")"
        print(json.dumps(res, indent=2))
    else:
        print("No vendor found")

if __name__ == "__main__":
    check()
