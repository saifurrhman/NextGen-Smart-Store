
import os
import django
from django.conf import settings
from pymongo import MongoClient

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

def test_mongo():
    print("Testing MongoDB connection...")
    uri = os.getenv('MONGO_URI')
    if not uri:
        print("MONGO_URI not found in environment!")
        return
    
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        print("MongoDB connection successful!")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")

if __name__ == "__main__":
    test_mongo()
