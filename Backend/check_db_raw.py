import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings')
django.setup()

from core.utils import get_mongo_db
from bson import ObjectId

db = get_mongo_db()
coll = db['orders_vendorbulkorder']

print("Raw MongoDB records for bulk orders:")
for doc in coll.find({}):
    vid = doc.get('vendor_id')
    print(f"ID: {doc.get('id')}, vendor_id: {vid}, type(vendor_id): {type(vid)}")
