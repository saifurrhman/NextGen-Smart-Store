import os
import django
import sys
from datetime import datetime
import random

# Setup Django
sys.path.append('.')
os.environ['DJANGO_SETTINGS_MODULE'] = 'NextGenSmartStore.settings.development'
django.setup()

from core.utils import get_mongo_db
from django.contrib.auth import get_user_model

def seed():
    db = get_mongo_db()
    User = get_user_model()
    
    vendor_email = "devugo.tech@gmail.com"
    vendor = User.objects.filter(email=vendor_email).first()
    
    if not vendor:
        print(f"Error: Vendor {vendor_email} not found.")
        return

    print(f"Seeding samples for {vendor_email}...")

    samples = [
        {
            'status': 'pending',
            'total_amount': 5500.0,
            'items': [
                {'product_id': '15', 'qty': 100, 'price': 25.0},
                {'product_id': '16', 'qty': 20, 'price': 150.0}
            ],
            'created_at': datetime(2026, 4, 1, 10, 0)
        },
        {
            'status': 'shipped',
            'total_amount': 16250.0,
            'items': [
                {'product_id': '17', 'qty': 50, 'price': 85.0},
                {'product_id': '18', 'qty': 10, 'price': 1200.0}
            ],
            'created_at': datetime(2026, 3, 20, 14, 30)
        },
        {
            'status': 'canceled',
            'total_amount': 2500.0,
            'items': [
                {'product_id': '15', 'qty': 100, 'price': 25.0}
            ],
            'created_at': datetime(2026, 3, 10, 9, 0)
        }
    ]

    # Get max IDs to avoid collision
    try:
        max_order_id = db['orders_vendorbulkorder'].find_one(sort=[("id", -1)])['id'] or 1000
        max_item_id = db['orders_vendorbulkorderitem'].find_one(sort=[("id", -1)])['id'] or 1000
    except:
        max_order_id = random.randint(2000, 5000)
        max_item_id = random.randint(5000, 10000)

    for i, s in enumerate(samples):
        max_order_id += 1
        # Create Bulk Order
        order_doc = {
            'id': max_order_id,
            'vendor_id': vendor.id,
            'status': s['status'],
            'total_amount': s['total_amount'],
            'created_at': s['created_at'],
            'updated_at': datetime.now()
        }
        res = db['orders_vendorbulkorder'].insert_one(order_doc)
        order_mongo_id = res.inserted_id
        
        # Create Items
        for item in s['items']:
            max_item_id += 1
            item_doc = {
                'id': max_item_id,
                'bulk_order_id': max_order_id, # Djongo uses the numeric ID for FK usually
                'master_product_id': item['product_id'],
                'quantity': item['qty'],
                'price': item['price']
            }
            db['orders_vendorbulkorderitem'].insert_one(item_doc)

    print(f"Successfully seeded 3 sample bulk orders starting from Order ID {max_order_id-2}.")

if __name__ == "__main__":
    seed()
