# -*- coding: utf-8 -*-
"""
NextGen Smart Store - MASTER DEMO DATA SEEDER
Run: python seed_master_demo.py
"""

import os
import sys
import django
import random
from decimal import Decimal
from datetime import datetime, timedelta, date

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from apps.products.models import Product
from apps.categories.models import Category
from apps.marketing.models import Campaign, Promotion, Coupon, Ad
from apps.settings.models import PaymentGateway, TaxRegion
from core.utils import get_mongo_db
from bson import ObjectId
from bson.decimal128 import Decimal128

User = get_user_model()


def d128(val):
    s = str(val).strip()
    s = ''.join(c for c in s if c.isdigit() or c in '.-')
    if not s or s == '.':
        s = "0.00"
    return Decimal128(s)


def get_or_create_user(email, username, first_name, last_name, role, password,
                        is_staff=False, is_superuser=False):
    user = User.objects.filter(email=email).first()
    if user:
        print("  [EXISTS] " + email)
        return user
    user = User(email=email, username=username, first_name=first_name,
                last_name=last_name, role=role, is_staff=is_staff, is_superuser=is_superuser)
    user.set_password(password)
    user.save()
    print("  [CREATED] " + email + " | Password: " + password)
    return user


def get_or_create_category(name, slug, description=""):
    cat = Category.objects.filter(slug=slug).first()
    if cat:
        return cat
    cat = Category.objects.create(name=name, slug=slug, description=description, is_active=True)
    print("  [CATEGORY] " + name)
    return cat


# =============================================================================
# 1. USERS
# =============================================================================

def seed_users():
    print("\n[*] SEEDING USERS...")

    admin = get_or_create_user(
        email='admin@nextgen.com', username='admin',
        first_name='Super', last_name='Admin',
        role='SUPER_ADMIN', password='Admin@123',
        is_staff=True, is_superuser=True
    )

    vendors = [
        get_or_create_user('vendor1@store.com', 'vendor1', 'Ahmed', 'Textiles', 'VENDOR', 'Vendor@123', is_staff=True),
        get_or_create_user('vendor2@store.com', 'vendor2', 'Fatima', 'Electronics', 'VENDOR', 'Vendor@123', is_staff=True),
        get_or_create_user('vendor3@store.com', 'vendor3', 'Usman', 'Sports Hub', 'VENDOR', 'Vendor@123', is_staff=True),
    ]

    customers = [
        get_or_create_user('ali@gmail.com',    'ali_khan',  'Ali',    'Khan',  'CUSTOMER', 'Customer@123'),
        get_or_create_user('sara@gmail.com',   'sara_butt', 'Sara',   'Butt',  'CUSTOMER', 'Customer@123'),
        get_or_create_user('zain@gmail.com',   'zain123',   'Zain',   'Malik', 'CUSTOMER', 'Customer@123'),
        get_or_create_user('ayesha@gmail.com', 'ayesha_m',  'Ayesha', 'Mirza', 'CUSTOMER', 'Customer@123'),
        get_or_create_user('hamza@gmail.com',  'hamza_r',   'Hamza',  'Raza',  'CUSTOMER', 'Customer@123'),
    ]

    delivery_persons = [
        get_or_create_user('rider1@delivery.com', 'rider1', 'Bilal', 'Rider', 'DELIVERY', 'Rider@123', is_staff=True),
        get_or_create_user('rider2@delivery.com', 'rider2', 'Kamran', 'Express', 'DELIVERY', 'Rider@123', is_staff=True),
    ]

    return admin, vendors, customers, delivery_persons


# =============================================================================
# 2. CATEGORIES
# =============================================================================

def seed_categories():
    print("\n[*] SEEDING CATEGORIES...")
    cats = [
        get_or_create_category('Fashion & Clothing', 'fashion-clothing', 'Shirts, trousers, dresses'),
        get_or_create_category('Electronics',         'electronics',      'Mobiles, laptops, gadgets'),
        get_or_create_category('Home & Living',       'home-living',      'Furniture, decor, kitchen'),
        get_or_create_category('Sports & Fitness',    'sports-fitness',   'Gym, outdoor, sports gear'),
        get_or_create_category('Food & Grocery',      'food-grocery',     'Fresh food and daily essentials'),
        get_or_create_category('Books & Education',   'books-education',  'Textbooks, novels, stationery'),
        get_or_create_category('Beauty & Skincare',   'beauty-skincare',  'Makeup, creams, hair care'),
        get_or_create_category('Toys & Kids',         'toys-kids',        'Toys, games, baby products'),
    ]
    return cats


# =============================================================================
# 3. PRODUCTS
# =============================================================================

DEMO_PRODUCTS = [
    # Fashion
    dict(title='Classic White Kurta', price=1499, dp=1199, cat='fashion-clothing', brand='Al-Karam', stock=150, sku='KRT-001', tag='bestseller'),
    dict(title='Blue Denim Jeans', price=2999, dp=2499, cat='fashion-clothing', brand='Outfitters', stock=80, sku='JNS-002', tag='featured'),
    dict(title='Floral Summer Dress', price=3499, dp=2799, cat='fashion-clothing', brand='Khaadi', stock=60, sku='DRS-003', tag='new'),
    dict(title="Men's Polo T-Shirt", price=999, dp=799, cat='fashion-clothing', brand='Binnys', stock=200, sku='PLO-004', tag='sale'),
    dict(title='Embroidered Lawn Suit', price=4999, dp=3999, cat='fashion-clothing', brand='Sana Safinaz', stock=45, sku='LWN-005', tag='trending'),
    dict(title='Black Formal Trousers', price=2499, dp=1999, cat='fashion-clothing', brand='Bonanza', stock=90, sku='TRS-006', tag=''),
    dict(title='Silk Evening Abaya', price=6999, dp=5499, cat='fashion-clothing', brand='Alkaram', stock=30, sku='ABY-007', tag='luxury'),
    dict(title="Men's Casual Hoodie", price=2999, dp=2299, cat='fashion-clothing', brand='Breakout', stock=110, sku='HDY-008', tag='bestseller'),
    # Electronics
    dict(title='Samsung Galaxy A55', price=89999, dp=84999, cat='electronics', brand='Samsung', stock=25, sku='PHN-009', tag='featured'),
    dict(title='Apple iPhone 15', price=289999, dp=279999, cat='electronics', brand='Apple', stock=15, sku='PHN-010', tag='premium'),
    dict(title='Xiaomi Redmi Note 13', price=59999, dp=54999, cat='electronics', brand='Xiaomi', stock=40, sku='PHN-011', tag='bestseller'),
    dict(title='Dell Inspiron Laptop 15', price=149999, dp=134999, cat='electronics', brand='Dell', stock=20, sku='LPT-012', tag='featured'),
    dict(title='Wireless Bluetooth Earbuds', price=4999, dp=3999, cat='electronics', brand='JBL', stock=100, sku='EBD-013', tag='trending'),
    dict(title='Smart 4K LED TV 55', price=119999, dp=99999, cat='electronics', brand='TCL', stock=18, sku='TV-014', tag='sale'),
    dict(title='HP DeskJet Printer', price=24999, dp=21999, cat='electronics', brand='HP', stock=35, sku='PRT-015', tag=''),
    dict(title='Gaming Mouse Logitech G502', price=8999, dp=7499, cat='electronics', brand='Logitech', stock=60, sku='MSE-016', tag=''),
    # Home & Living
    dict(title='Non-Stick Cooking Pan Set', price=3999, dp=2999, cat='home-living', brand='Prestige', stock=75, sku='PAN-017', tag='bestseller'),
    dict(title='Memory Foam Pillow', price=2499, dp=1999, cat='home-living', brand='Comfort Home', stock=120, sku='PIL-018', tag=''),
    dict(title='Wooden Dining Table 6 Seater', price=49999, dp=42999, cat='home-living', brand='Sheesham Craft', stock=10, sku='TBL-019', tag='premium'),
    dict(title='LED Floor Lamp', price=6999, dp=5499, cat='home-living', brand='Philips', stock=45, sku='LMP-020', tag='featured'),
    dict(title='Ceramic Dinner Set 12pc', price=7999, dp=6499, cat='home-living', brand='Royal Doulton', stock=30, sku='DIN-021', tag=''),
    # Sports & Fitness
    dict(title='Yoga Mat Anti-Slip', price=2499, dp=1999, cat='sports-fitness', brand='YogaFlex', stock=85, sku='YGA-022', tag='trending'),
    dict(title='Dumbbells Set 10kg Pair', price=5999, dp=4999, cat='sports-fitness', brand='ProFit', stock=50, sku='DUM-023', tag='bestseller'),
    dict(title='Running Shoes Nike Air Max', price=19999, dp=16999, cat='sports-fitness', brand='Nike', stock=40, sku='SHO-024', tag='featured'),
    dict(title='Cricket Bat Full Size', price=8999, dp=7499, cat='sports-fitness', brand='Gray-Nicolls', stock=65, sku='CKT-025', tag=''),
    dict(title='Protein Whey 2.5kg', price=12999, dp=10999, cat='sports-fitness', brand='Optimum Nutrition', stock=70, sku='PRO-026', tag='sale'),
    # Food & Grocery
    dict(title='Basmati Rice 5kg Premium', price=1299, dp=1099, cat='food-grocery', brand='Guard', stock=300, sku='RIC-027', tag='bestseller'),
    dict(title='Extra Virgin Olive Oil 1L', price=2499, dp=1999, cat='food-grocery', brand='Borges', stock=150, sku='OIL-028', tag=''),
    dict(title='Mixed Dry Fruits 500g', price=1999, dp=1699, cat='food-grocery', brand='Nuttys', stock=200, sku='DRY-029', tag='featured'),
    dict(title='Organic Honey 500ml', price=1799, dp=1499, cat='food-grocery', brand='National', stock=180, sku='HON-030', tag='organic'),
    # Beauty & Skincare
    dict(title='Neutrogena Face Wash 200ml', price=999, dp=799, cat='beauty-skincare', brand='Neutrogena', stock=250, sku='FWS-031', tag='bestseller'),
    dict(title='Vitamin C Serum 30ml', price=2499, dp=1999, cat='beauty-skincare', brand='Cosrx', stock=90, sku='SRM-032', tag='trending'),
    dict(title='Herbal Shampoo 400ml', price=699, dp=549, cat='beauty-skincare', brand='Himalaya', stock=300, sku='SHP-033', tag=''),
    dict(title='Lipstick Matte Collection', price=1299, dp=999, cat='beauty-skincare', brand='Maybelline', stock=150, sku='LPS-034', tag='sale'),
    # Books
    dict(title='The Alchemist Urdu', price=799, dp=649, cat='books-education', brand='Fiction House', stock=400, sku='BKU-035', tag='bestseller'),
    dict(title='Principles of Economics', price=2499, dp=1999, cat='books-education', brand='Maktaba', stock=100, sku='BKE-036', tag=''),
    dict(title='Python Programming Guide', price=1999, dp=1599, cat='books-education', brand='Tech Books', stock=120, sku='BKT-037', tag='featured'),
    # Toys
    dict(title='LEGO City Set 500pcs', price=9999, dp=7999, cat='toys-kids', brand='LEGO', stock=35, sku='TOY-038', tag='featured'),
    dict(title='Remote Control Car', price=3499, dp=2799, cat='toys-kids', brand='Nikko', stock=60, sku='TOY-039', tag='trending'),
    dict(title='Baby Soft Toy Teddy Bear', price=1499, dp=1199, cat='toys-kids', brand='Gund', stock=100, sku='TOY-040', tag='bestseller'),
]


def seed_products(categories, vendors):
    print("\n[*] SEEDING PRODUCTS...")
    cat_map = {cat.slug: cat for cat in categories}
    created = []

    for p_data in DEMO_PRODUCTS:
        sku = p_data['sku']
        existing = Product.objects.filter(sku=sku).first()
        if existing:
            print("  [EXISTS] " + p_data['title'])
            created.append(existing)
            continue

        vendor = random.choice(vendors)
        cat = cat_map.get(p_data['cat'], categories[0])

        from django.utils.text import slugify
        import time
        slug = slugify(p_data['title']) + "-" + str(int(time.time() * 1000) % 99999)

        product = Product.objects.create(
            title=p_data['title'],
            slug=slug,
            description="Premium quality " + p_data['title'] + ". Fast delivery across Pakistan.",
            price=Decimal(str(p_data['price'])),
            discount_price=Decimal(str(p_data['dp'])),
            discount_type='FIXED',
            discount_value=Decimal(str(p_data['price'] - p_data['dp'])),
            is_tax_included=True,
            currency='PKR',
            stock=p_data['stock'],
            min_stock=10,
            stock_status='IN_STOCK',
            sku=sku,
            brand=p_data.get('brand', ''),
            category=cat,
            vendor=vendor,
            tag=p_data.get('tag', ''),
            highlight_featured=(p_data.get('tag') in ['featured', 'bestseller']),
            is_active=True,
        )
        print("  [PRODUCT] " + p_data['title'] + " | PKR " + str(p_data['price']))
        created.append(product)

    print("  Total Products: " + str(len(created)))
    return created


# =============================================================================
# 4. CUSTOMER ORDERS
# =============================================================================

def seed_orders(customers, products, db):
    print("\n[*] SEEDING CUSTOMER ORDERS...")
    order_statuses = ['pending', 'processing', 'shipped', 'delivered', 'delivered']
    payment_methods = ['JazzCash', 'EasyPaisa', 'CreditCard', 'BankTransfer', 'COD']
    cities = ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad']
    count = 0

    for i in range(30):
        customer = random.choice(customers)
        status = random.choice(order_statuses)
        selected = random.sample(products, random.randint(1, 4))
        order_total = Decimal('0')
        items_data = []

        for p in selected:
            qty = random.randint(1, 3)
            unit_price = float(str(p.discount_price or p.price))
            line_total = Decimal(str(unit_price)) * qty
            order_total += line_total
            items_data.append({
                'product_id': p.id,
                'product_title': p.title,
                'quantity': qty,
                'price': d128(unit_price),
                'line_total': d128(float(line_total)),
            })

        tax = order_total * Decimal('0.17')
        shipping = Decimal('200') if order_total < Decimal('3000') else Decimal('0')
        grand = order_total + tax + shipping
        city = random.choice(cities)
        order_id = ObjectId()
        created_at = datetime.now() - timedelta(days=random.randint(0, 90))

        db['orders_order'].insert_one({
            '_id': order_id, 'id': order_id,
            'user_id': customer.id, 'status': status,
            'payment_method': random.choice(payment_methods),
            'payment_status': 'paid' if status in ['shipped', 'delivered'] else 'pending',
            'subtotal': d128(float(order_total)),
            'tax_amount': d128(float(tax)),
            'shipping_fee': d128(float(shipping)),
            'total_amount': d128(float(grand)),
            'shipping_city': city,
            'shipping_address': "House #" + str(random.randint(1, 500)) + ", Block " + random.choice('ABCDEFG') + ", " + city,
            'created_at': created_at, 'updated_at': created_at,
            'notes': 'Demo order seeded by system',
        })
        for item in items_data:
            iid = ObjectId()
            db['orders_orderitem'].insert_one({'_id': iid, 'id': iid, 'order_id': order_id, **item})
        count += 1

    print("  Created " + str(count) + " customer orders with tax (17% GST) + shipping.")


# =============================================================================
# 5. VENDOR BULK ORDERS + DELIVERY
# =============================================================================

def seed_vendor_bulk_orders(vendors, products, delivery_persons, db):
    print("\n[*] SEEDING VENDOR BULK ORDERS AND DELIVERY...")
    bulk_statuses = ['pending', 'processing', 'approved', 'shipped', 'delivered']

    for vendor in vendors:
        for _ in range(3):
            selected = random.sample(products, random.randint(2, 5))
            bulk_total = Decimal('0')
            order_id = ObjectId()
            created_at = datetime.now() - timedelta(days=random.randint(1, 60))
            status = random.choice(bulk_statuses)

            db['orders_vendorbulkorder'].insert_one({
                '_id': order_id, 'id': order_id,
                'vendor_id': vendor.id, 'status': status,
                'total_amount': d128(0),
                'notes': 'Demo bulk order from ' + vendor.first_name,
                'created_at': created_at, 'updated_at': created_at,
            })

            for p in selected:
                qty = random.randint(50, 300)
                wholesale = float(str(p.price)) * 0.6
                line = Decimal(str(wholesale)) * qty
                bulk_total += line
                iid = ObjectId()
                db['orders_vendorbulkorderitem'].insert_one({
                    '_id': iid, 'id': iid,
                    'bulk_order_id': order_id,
                    'master_product_id': p.id,
                    'product_title': p.title,
                    'quantity': qty,
                    'price': d128(wholesale),
                    'line_total': d128(float(line)),
                })

            db['orders_vendorbulkorder'].update_one(
                {'_id': order_id},
                {'$set': {'total_amount': d128(float(bulk_total))}}
            )

            if status in ['shipped', 'delivered'] and delivery_persons:
                rider = random.choice(delivery_persons)
                did = ObjectId()
                db['delivery_assignments'].insert_one({
                    '_id': did, 'bulk_order_id': order_id,
                    'vendor_id': vendor.id,
                    'delivery_person_id': rider.id,
                    'delivery_person_name': rider.first_name + " " + rider.last_name,
                    'delivery_person_email': rider.email,
                    'status': status, 'assigned_at': created_at,
                    'delivered_at': created_at + timedelta(days=3) if status == 'delivered' else None,
                })

    print("  Created vendor bulk orders and delivery assignments.")


# =============================================================================
# 6. MARKETING
# =============================================================================

def seed_marketing():
    print("\n[*] SEEDING MARKETING DATA...")
    mkt_count = 0

    campaigns = [
        dict(name='Eid Sale Mega Campaign', platform='facebook', status='active',
             budget=Decimal('50000'), spent=Decimal('32500'),
             impressions=450000, clicks=18500, conversions=1250,
             start_date=date.today()-timedelta(15), end_date=date.today()+timedelta(15)),
        dict(name='Independence Day Sale', platform='instagram', status='active',
             budget=Decimal('30000'), spent=Decimal('18750'),
             impressions=280000, clicks=9600, conversions=720,
             start_date=date.today()-timedelta(10), end_date=date.today()+timedelta(20)),
        dict(name='Summer Fashion Week', platform='google', status='scheduled',
             budget=Decimal('75000'), spent=Decimal('0'),
             impressions=0, clicks=0, conversions=0,
             start_date=date.today()+timedelta(5), end_date=date.today()+timedelta(35)),
        dict(name='Back to School Drive', platform='tiktok', status='ended',
             budget=Decimal('20000'), spent=Decimal('20000'),
             impressions=620000, clicks=24000, conversions=1850,
             start_date=date.today()-timedelta(45), end_date=date.today()-timedelta(15)),
        dict(name='Winter Collection Launch', platform='email', status='draft',
             budget=Decimal('15000'), spent=Decimal('0'),
             impressions=0, clicks=0, conversions=0,
             start_date=date.today()+timedelta(30), end_date=date.today()+timedelta(60)),
    ]
    for c in campaigns:
        if not Campaign.objects.filter(name=c['name']).exists():
            Campaign.objects.create(**c)
            mkt_count += 1
            print("  [CAMPAIGN] " + c['name'])

    promotions = [
        dict(name='Eid Mega Sale - 30% Off', type='percentage', discount='30%',
             status='active', usage_limit=5000, redeemed=1823,
             start_date=date.today()-timedelta(5), end_date=date.today()+timedelta(10)),
        dict(name='Free Shipping PKR 3000+', type='shipping', discount='Free Shipping',
             status='active', usage_limit=10000, redeemed=4521,
             start_date=date.today()-timedelta(30), end_date=date.today()+timedelta(60)),
        dict(name='New Customer PKR 500 Off', type='fixed', discount='PKR 500',
             status='active', usage_limit=2000, redeemed=398,
             start_date=date.today()-timedelta(7), end_date=date.today()+timedelta(30)),
        dict(name='Buy 2 Get 1 Free Electronics', type='bogo', discount='Buy 2 Get 1',
             status='upcoming', usage_limit=500, redeemed=0,
             start_date=date.today()+timedelta(5), end_date=date.today()+timedelta(20)),
    ]
    for p in promotions:
        if not Promotion.objects.filter(name=p['name']).exists():
            Promotion.objects.create(**p)
            mkt_count += 1

    coupons = [
        dict(code='EID30', discount='30% Off', min_purchase=Decimal('2000'),
             valid_from=date.today()-timedelta(5), valid_until=date.today()+timedelta(10), status='active'),
        dict(code='SAVE500', discount='PKR 500 Off', min_purchase=Decimal('3000'),
             valid_from=date.today()-timedelta(2), valid_until=date.today()+timedelta(28), status='active'),
        dict(code='WELCOME20', discount='20% Off', min_purchase=Decimal('1000'),
             valid_from=date.today()-timedelta(30), valid_until=date.today()+timedelta(60), status='active'),
        dict(code='FREESHIP', discount='Free Shipping', min_purchase=Decimal('1500'),
             valid_from=date.today()-timedelta(15), valid_until=date.today()+timedelta(15), status='active'),
        dict(code='SUMMER15', discount='15% Off', min_purchase=Decimal('1000'),
             valid_from=date.today()-timedelta(60), valid_until=date.today()-timedelta(30), status='expired'),
    ]
    for c in coupons:
        if not Coupon.objects.filter(code=c['code']).exists():
            Coupon.objects.create(**c)
            mkt_count += 1
            print("  [COUPON] " + c['code'])

    ads = [
        dict(campaign_name='Eid Fashion Sale', platform='facebook', status='active',
             spend=Decimal('18500'), impressions=250000, clicks=12400, roas=Decimal('3.8')),
        dict(campaign_name='Summer Electronics', platform='google', status='active',
             spend=Decimal('25000'), impressions=180000, clicks=9200, roas=Decimal('4.2')),
        dict(campaign_name='Back to School', platform='instagram', status='ended',
             spend=Decimal('12000'), impressions=320000, clicks=18600, roas=Decimal('5.1')),
        dict(campaign_name='Flash Sale 24hrs', platform='tiktok', status='paused',
             spend=Decimal('8000'), impressions=95000, clicks=5800, roas=Decimal('2.9')),
    ]
    for a in ads:
        if not Ad.objects.filter(campaign_name=a['campaign_name']).exists():
            Ad.objects.create(**a)
            mkt_count += 1

    print("  Marketing records created: " + str(mkt_count))


# =============================================================================
# 7. TAX & PAYMENT SETTINGS
# =============================================================================

def seed_settings():
    print("\n[*] SEEDING PAYMENT GATEWAYS AND TAX REGIONS...")

    gateways = [
        dict(name='JazzCash', provider='PMCL', transaction_fee='2.5%', success_rate=Decimal('97.2'), status='active'),
        dict(name='EasyPaisa', provider='Telenor Microfinance', transaction_fee='2.0%', success_rate=Decimal('96.8'), status='active'),
        dict(name='HBL Credit Card', provider='HBL Bank', transaction_fee='3.0%', success_rate=Decimal('98.1'), status='active'),
        dict(name='Cash on Delivery', provider='In-House', transaction_fee='0%', success_rate=Decimal('99.9'), status='active'),
        dict(name='Bank Transfer', provider='SBP', transaction_fee='1.5%', success_rate=Decimal('99.5'), status='active'),
        dict(name='Stripe International', provider='Stripe', transaction_fee='3.5%', success_rate=Decimal('99.2'), status='inactive'),
    ]
    for g in gateways:
        if not PaymentGateway.objects.filter(name=g['name']).exists():
            PaymentGateway.objects.create(**g)
            print("  [GATEWAY] " + g['name'])

    taxes = [
        dict(region='Federal GST Pakistan', tax_class='Standard', rate=Decimal('17.00'), is_compound=False, status='active'),
        dict(region='Punjab Sales Tax', tax_class='Services', rate=Decimal('16.00'), is_compound=False, status='active'),
        dict(region='Sindh Sales Tax', tax_class='Services', rate=Decimal('13.00'), is_compound=False, status='active'),
        dict(region='KPK Sales Tax', tax_class='Standard', rate=Decimal('15.00'), is_compound=False, status='active'),
        dict(region='Balochistan', tax_class='Standard', rate=Decimal('15.00'), is_compound=False, status='active'),
        dict(region='AJK Azad Kashmir', tax_class='Standard', rate=Decimal('12.00'), is_compound=False, status='active'),
        dict(region='International VAT', tax_class='VAT', rate=Decimal('20.00'), is_compound=True, status='inactive'),
        dict(region='Export Zero Rated', tax_class='Zero Rate', rate=Decimal('0.00'), is_compound=False, status='active'),
    ]
    for t in taxes:
        if not TaxRegion.objects.filter(region=t['region']).exists():
            TaxRegion.objects.create(**t)
            print("  [TAX] " + t['region'] + ": " + str(t['rate']) + "%")

    print("  Settings seeded.")


# =============================================================================
# 8. FINANCIAL TRANSACTIONS
# =============================================================================

def seed_transactions(db):
    print("\n[*] SEEDING FINANCIAL TRANSACTIONS...")
    orders = list(db['orders_order'].find().sort('created_at', -1).limit(30))
    payment_methods = ['JazzCash', 'EasyPaisa', 'HBL Credit Card', 'COD', 'Bank Transfer']

    for order in orders:
        txn_id = ObjectId()
        db['finance_transaction'].insert_one({
            '_id': txn_id,
            'order_id': order.get('_id'),
            'amount': order.get('total_amount', d128(0)),
            'payment_method': random.choice(payment_methods),
            'status': 'success' if order.get('payment_status') == 'paid' else 'pending',
            'gateway_reference': 'TXN' + str(txn_id)[:10].upper(),
            'created_at': order.get('created_at', datetime.now()),
        })

    print("  Created " + str(len(orders)) + " financial transactions.")


# =============================================================================
# MAIN
# =============================================================================

def main():
    print("=" * 60)
    print("  NextGen Smart Store - MASTER DEMO DATA SEEDER")
    print("=" * 60)

    db = get_mongo_db()

    admin, vendors, customers, delivery_persons = seed_users()
    categories = seed_categories()
    products = seed_products(categories, vendors)

    if products and customers:
        seed_orders(customers, products, db)
    else:
        print("[!] Skipping orders - no products or customers found.")

    if products and vendors:
        seed_vendor_bulk_orders(vendors, products, delivery_persons, db)

    seed_marketing()
    seed_settings()
    seed_transactions(db)

    print("\n" + "=" * 60)
    print("  SEEDING COMPLETE!")
    print("=" * 60)
    print("\nLOGIN CREDENTIALS:")
    print("  Admin:    admin@nextgen.com     | Admin@123")
    print("  Vendor 1: vendor1@store.com     | Vendor@123")
    print("  Vendor 2: vendor2@store.com     | Vendor@123")
    print("  Vendor 3: vendor3@store.com     | Vendor@123")
    print("  Customer: ali@gmail.com         | Customer@123")
    print("  Rider:    rider1@delivery.com   | Rider@123")
    print("\nFrontend: http://localhost:3000")
    print("Backend:  http://localhost:8000")
    print("=" * 60)


if __name__ == '__main__':
    main()
