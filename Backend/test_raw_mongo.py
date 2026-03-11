from core.utils import get_mongo_db

db = get_mongo_db()
collection = db['products_product']

docs = list(collection.find({}))
for doc in docs:
    print(f"Title: {doc.get('title')}")
    print(f"_id: {doc.get('_id')} (type {type(doc.get('_id'))})")
    print(f"id: {doc.get('id')} (type {type(doc.get('id'))})")
    print("---")
