import os
import sys
import django
import json
import random
from decimal import Decimal
from datetime import datetime, timedelta
from bson.decimal128 import Decimal128
from bson import ObjectId

# Function to convert to Decimal128 for PyMongo
def to_d128(val):
    if val is None: return Decimal128("0.00")
    s = str(val).strip()
    s = ''.join(c for c in s if c.isdigit() or c in '.-')
    if not s: s = "0.00"
    return Decimal128(s)

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from apps.products.models import Product, ProductImage
from apps.categories.models import Category
from apps.orders.models import Order, OrderItem, VendorBulkOrder, VendorBulkOrderItem
from core.utils import get_mongo_db

User = get_user_model()

def get_or_create_user(email, defaults):
    user = User.objects.filter(email=email).first()
    if user:
        return user, False
    user = User.objects.create(email=email, **defaults)
    return user, True

def seed_all():
    print("--- STARTING COMPREHENSIVE SYSTEM SEEDING ---")
    db = get_mongo_db()

    # 1. SEED USERS
    print("Seeding Users...")
    
    # Super Admin
    admin_defaults = {
        'username': 'admin',
        'first_name': 'System',
        'last_name': 'Administrator',
        'role': 'SUPER_ADMIN',
        'is_staff': True,
        'is_superuser': True
    }
    admin, created = get_or_create_user('admin@nextgen.com', admin_defaults)
    if created:
        admin.set_password('admin123')
        admin.save()
        print("Created Super Admin: admin@nextgen.com")

    # Vendors
    vendors = []
    for i in range(1, 4):
        v_email = f'vendor{i}@store.com'
        v_defaults = {
            'username': f'vendor{i}',
            'first_name': f'Vendor',
            'last_name': f'Company {i}',
            'role': 'VENDOR',
            'is_staff': True
        }
        vendor, created = get_or_create_user(v_email, v_defaults)
        if created:
            vendor.set_password('vendor123')
            vendor.save()
            print(f"Created Vendor: {v_email}")
        vendors.append(vendor)

    # Customers
    customers = []
    for i in range(1, 5):
        c_email = f'customer{i}@gmail.com'
        c_defaults = {
            'username': f'customer{i}',
            'first_name': f'Customer',
            'last_name': f'User {i}',
            'role': 'CUSTOMER'
        }
        customer, created = get_or_create_user(c_email, c_defaults)
        if created:
            customer.set_password('customer123')
            customer.save()
            print(f"Created Customer: {c_email}")
        customers.append(customer)

    # 2. ENSURE PRODUCTS EXIST
    print("Linking Products to Vendors...")
    all_products = list(Product.objects.all())
    vendor_ids = [v.id for v in vendors]
    if not all_products:
        print("No products found!")
    else:
        for p in all_products:
            db['products_product'].update_one(
                {'_id': p.id},
                {'$set': {'vendor_id': random.choice(vendor_ids)}}
            )
        print(f"Linked {len(all_products)} products to valid vendor IDs.")

    # 3. SEED ORDERS
    print("Seeding Orders...")
    if all_products and customers:
        for i in range(15):
            cust = random.choice(customers)
            new_order_id = ObjectId()
            db['orders_order'].insert_one({
                '_id': new_order_id,
                'id': new_order_id,
                'user_id': cust.id,
                'status': random.choice(['pending', 'processing', 'shipped', 'delivered']),
                'total_amount': Decimal128("0.00"),
                'created_at': datetime.now(),
                'updated_at': datetime.now()
            })
            
            order_total = Decimal("0.00")
            items_count = random.randint(1, 4)
            selected_products = random.sample(all_products, items_count)
            
            for p in selected_products:
                qty = random.randint(1, 3)
                p_price_val = str(p.discount_price if p.discount_price else p.price)
                p_price_cleaned = ''.join(c for c in p_price_val if c.isdigit() or c in '.-')
                price_dec = Decimal(p_price_cleaned)
                
                new_item_id = ObjectId()
                db['orders_orderitem'].insert_one({
                    '_id': new_item_id,
                    'id': new_item_id,
                    'order_id': new_order_id,
                    'product_id': p.id,
                    'quantity': qty,
                    'price': Decimal128(p_price_cleaned)
                })
                order_total += price_dec * qty
            
            db['orders_order'].update_one({'_id': new_order_id}, {'$set': {'total_amount': Decimal128(str(order_total))}})
        print("Created 15 random customer orders via Direct Mongo.")

    # 4. SEED VENDOR BULK ORDERS
    print("Seeding Vendor Bulk Orders...")
    if all_products:
        for v in vendors:
            new_bulk_order_id = ObjectId()
            db['orders_vendorbulkorder'].insert_one({
                '_id': new_bulk_order_id,
                'id': new_bulk_order_id,
                'vendor_id': v.id,
                'status': random.choice(['pending', 'approved', 'shipped']),
                'total_amount': Decimal128("0.00"),
                'created_at': datetime.now(),
                'updated_at': datetime.now()
            })
            
            bulk_total = Decimal("0.00")
            p_to_order = random.sample(all_products, random.randint(1, 2))
            for p in p_to_order:
                qty = random.randint(50, 200)
                p_price_val = str(p.price)
                p_price_cleaned = ''.join(c for c in p_price_val if c.isdigit() or c in '.-')
                wholesale_price_dec = Decimal(p_price_cleaned) * Decimal("0.6")
                
                new_bulk_item_id = ObjectId()
                db['orders_vendorbulkorderitem'].insert_one({
                    '_id': new_bulk_item_id,
                    'id': new_bulk_item_id,
                    'bulk_order_id': new_bulk_order_id,
                    'master_product_id': p.id,
                    'quantity': qty,
                    'price': Decimal128(str(wholesale_price_dec))
                })
                bulk_total += wholesale_price_dec * qty
            
            db['orders_vendorbulkorder'].update_one({'_id': new_bulk_order_id}, {'$set': {'total_amount': Decimal128(str(bulk_total))}})
        print("Created bulk orders for all vendors via Direct Mongo.")

    print("\n--- SEEDING COMPLETED SUCCESSFULLY ---")

if __name__ == '__main__':
    seed_all()
