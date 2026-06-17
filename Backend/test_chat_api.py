"""
Quick diagnostic script — run this ONCE from the Backend folder:
  python test_chat_api.py
"""
import os, sys, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
sys.path.insert(0, '.')
django.setup()

from core.utils import get_mongo_db
from bson import ObjectId
from datetime import datetime

db = get_mongo_db()
col = db['support_chatsession']

print("=" * 50)
print(f"Total documents in support_chatsession: {col.count_documents({})}")
print()

# Show existing docs
for d in col.find().limit(5):
    print(f"  _id={d.get('_id')} | id={d.get('id')} | topic={d.get('topic')} | status={d.get('status')}")

print()

# Fix any null id docs
fixed = 0
for doc in col.find({'$or': [{'id': None}, {'id': {'$exists': False}}]}):
    col.update_one({'_id': doc['_id']}, {'$set': {'id': doc['_id']}})
    fixed += 1
print(f"Fixed {fixed} documents with null id.")

# Insert a test doc if collection is empty
if col.count_documents({}) == 0:
    oid = ObjectId()
    col.insert_one({
        '_id': oid, 'id': oid,
        'customer_name': 'Test Guest',
        'user_id': None, 'topic': 'Test Topic',
        'agent_id': None, 'status': 'waiting',
        'duration_seconds': 0,
        'created_at': datetime.now(),
        'updated_at': datetime.now()
    })
    print("Inserted 1 test document.")
    print(f"Total now: {col.count_documents({})}")

print("=" * 50)
print("Done! Now refresh the frontend.")
