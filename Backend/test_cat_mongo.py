from core.utils import get_mongo_db

db = get_mongo_db()
collection = db['categories_category']

docs = list(collection.find({}))
for doc in docs:
    print(f"Name: {doc.get('name')}")
    print(f"_id: {doc.get('_id')} (type {type(doc.get('_id'))})")
    print(f"id: {doc.get('id')} (type {type(doc.get('id'))})")
    print("---")
