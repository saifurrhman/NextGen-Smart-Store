import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from core.utils import get_mongo_db

def clean_attributes():
    db = get_mongo_db()
    res = db['attributes_attribute'].delete_many({})
    print(f'DELETED {res.deleted_count} attributes from the database.')

if __name__ == "__main__":
    clean_attributes()
