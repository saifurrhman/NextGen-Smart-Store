from django.conf import settings
import pymongo
from bson import ObjectId
from bson.decimal128 import Decimal128
from datetime import datetime

_mongo_client = None

def get_mongo_client():
    global _mongo_client
    if _mongo_client is None:
        db_config = settings.DATABASES['default']
        _mongo_client = pymongo.MongoClient(
            db_config['CLIENT']['host'], 
            tlsAllowInvalidCertificates=True
        )
    return _mongo_client

def get_mongo_db():
    client = get_mongo_client()
    db_name = settings.DATABASES['default']['NAME']
    return client[db_name]

def sanitize_mongo_doc(doc):
    """
    Recursively converts MongoDB-specific types (ObjectId, Decimal128, datetime)
    into JSON-serializable Python types.
    """
    if isinstance(doc, dict):
        if '_id' in doc:
            # Only map _id to id if id doesn't already exist (legacy docs have real integer ids)
            if 'id' not in doc:
                doc['id'] = str(doc.pop('_id'))
            else:
                doc['_id'] = str(doc.pop('_id'))
        for k, v in doc.items():
            doc[k] = sanitize_mongo_doc(v)
        return doc
    elif isinstance(doc, list):
        return [sanitize_mongo_doc(item) for item in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, Decimal128):
        return float(str(doc))
    elif isinstance(doc, datetime):
        return doc.isoformat()
    return doc
