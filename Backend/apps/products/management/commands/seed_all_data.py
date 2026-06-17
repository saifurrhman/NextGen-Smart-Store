"""
Django Management Command: seed_all_data
Usage: python manage.py seed_all_data

Seeds:
  - 8 Categories
  - 20 Products
  - 5 Customers + 3 Vendors + 2 Riders
  - 25 Customer Orders (with 17% GST tax)
  - 9 Vendor Bulk Orders + Delivery assignments
  - Marketing (Campaigns, Promotions, Coupons, Ads)
  - Payment Gateways + Tax Regions
  - Financial Transactions
"""
import random
from decimal import Decimal
from datetime import datetime, timedelta, date

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from bson import ObjectId
from bson.decimal128 import Decimal128

from apps.products.models import Product
from apps.categories.models import Category
from apps.marketing.models import Campaign, Promotion, Coupon, Ad
from apps.settings.models import PaymentGateway, TaxRegion
from core.utils import get_mongo_db

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
        return user, False
    user = User(email=email, username=username, first_name=first_name,
                last_name=last_name, role=role, is_staff=is_staff, is_superuser=is_superuser)
    user.set_password(password)
    user.save()
    return user, True


DEMO_PRODUCTS = [
    # Fashion (5)
    dict(title='Classic White Kurta', price=1499, dp=1199, cat='fashion-clothing', brand='Al-Karam', stock=150, sku='KRT-001', tag='bestseller'),
    dict(title='Blue Denim Jeans', price=2999, dp=2499, cat='fashion-clothing', brand='Outfitters', stock=80, sku='JNS-002', tag='featured'),
    dict(title='Floral Summer Dress', price=3499, dp=2799, cat='fashion-clothing', brand='Khaadi', stock=60, sku='DRS-003', tag='new'),
    dict(title="Men's Polo T-Shirt", price=999, dp=799, cat='fashion-clothing', brand='Binnys', stock=200, sku='PLO-004', tag='sale'),
    dict(title='Embroidered Lawn Suit', price=4999, dp=3999, cat='fashion-clothing', brand='Sana Safinaz', stock=45, sku='LWN-005', tag='trending'),
    # Electronics (5)
    dict(title='Samsung Galaxy A55', price=89999, dp=84999, cat='electronics', brand='Samsung', stock=25, sku='PHN-009', tag='featured'),
    dict(title='Apple iPhone 15', price=289999, dp=279999, cat='electronics', brand='Apple', stock=15, sku='PHN-010', tag='premium'),
    dict(title='Wireless Bluetooth Earbuds', price=4999, dp=3999, cat='electronics', brand='JBL', stock=100, sku='EBD-013', tag='trending'),
    dict(title='Smart 4K LED TV 55', price=119999, dp=99999, cat='electronics', brand='TCL', stock=18, sku='TV-014', tag='sale'),
    dict(title='Gaming Mouse Logitech G502', price=8999, dp=7499, cat='electronics', brand='Logitech', stock=60, sku='MSE-016', tag=''),
    # Home & Living (3)
    dict(title='Non-Stick Cooking Pan Set', price=3999, dp=2999, cat='home-living', brand='Prestige', stock=75, sku='PAN-017', tag='bestseller'),
    dict(title='LED Floor Lamp', price=6999, dp=5499, cat='home-living', brand='Philips', stock=45, sku='LMP-020', tag='featured'),
    dict(title='Memory Foam Pillow', price=2499, dp=1999, cat='home-living', brand='Comfort Home', stock=120, sku='PIL-018', tag=''),
    # Sports (2)
    dict(title='Yoga Mat Anti-Slip', price=2499, dp=1999, cat='sports-fitness', brand='YogaFlex', stock=85, sku='YGA-022', tag='trending'),
    dict(title='Dumbbells Set 10kg Pair', price=5999, dp=4999, cat='sports-fitness', brand='ProFit', stock=50, sku='DUM-023', tag='bestseller'),
    # Food (2)
    dict(title='Basmati Rice 5kg Premium', price=1299, dp=1099, cat='food-grocery', brand='Guard', stock=300, sku='RIC-027', tag='bestseller'),
    dict(title='Organic Honey 500ml', price=1799, dp=1499, cat='food-grocery', brand='National', stock=180, sku='HON-030', tag='organic'),
    # Beauty (2)
    dict(title='Neutrogena Face Wash 200ml', price=999, dp=799, cat='beauty-skincare', brand='Neutrogena', stock=250, sku='FWS-031', tag='bestseller'),
    dict(title='Vitamin C Serum 30ml', price=2499, dp=1999, cat='beauty-skincare', brand='Cosrx', stock=90, sku='SRM-032', tag='trending'),
    # Toys (1)
    dict(title='LEGO City Set 500pcs', price=9999, dp=7999, cat='toys-kids', brand='LEGO', stock=35, sku='TOY-038', tag='featured'),
]


class Command(BaseCommand):
    help = 'Seed complete demo data: products, orders, marketing, tax, delivery'

    def handle(self, *args, **kwargs):
        self.stdout.write('=' * 56)
        self.stdout.write('  NextGen Smart Store - SEEDING DEMO DATA')
        self.stdout.write('=' * 56)

        db = get_mongo_db()

        # ── 1. Users ───────────────────────────────────────────
        self.stdout.write('\n[1/8] Seeding Users...')
        admin, _ = get_or_create_user('admin@nextgen.com', 'admin', 'Super', 'Admin', 'SUPER_ADMIN', 'Admin@123', is_staff=True, is_superuser=True)
        vendors = [
            get_or_create_user('vendor1@store.com', 'vendor1', 'Ahmed', 'Textiles', 'VENDOR', 'Vendor@123', is_staff=True)[0],
            get_or_create_user('vendor2@store.com', 'vendor2', 'Fatima', 'Electronics', 'VENDOR', 'Vendor@123', is_staff=True)[0],
            get_or_create_user('vendor3@store.com', 'vendor3', 'Usman', 'Sports Hub', 'VENDOR', 'Vendor@123', is_staff=True)[0],
        ]
        customers = [
            get_or_create_user('ali@gmail.com', 'ali_khan', 'Ali', 'Khan', 'CUSTOMER', 'Customer@123')[0],
            get_or_create_user('sara@gmail.com', 'sara_butt', 'Sara', 'Butt', 'CUSTOMER', 'Customer@123')[0],
            get_or_create_user('zain@gmail.com', 'zain123', 'Zain', 'Malik', 'CUSTOMER', 'Customer@123')[0],
            get_or_create_user('ayesha@gmail.com', 'ayesha_m', 'Ayesha', 'Mirza', 'CUSTOMER', 'Customer@123')[0],
            get_or_create_user('hamza@gmail.com', 'hamza_r', 'Hamza', 'Raza', 'CUSTOMER', 'Customer@123')[0],
        ]
        riders = [
            get_or_create_user('rider1@delivery.com', 'rider1', 'Bilal', 'Rider', 'DELIVERY', 'Rider@123', is_staff=True)[0],
            get_or_create_user('rider2@delivery.com', 'rider2', 'Kamran', 'Express', 'DELIVERY', 'Rider@123', is_staff=True)[0],
        ]
        self.stdout.write(self.style.SUCCESS('    Done: 1 Admin, 3 Vendors, 5 Customers, 2 Riders'))

        # ── 2. Categories ──────────────────────────────────────
        self.stdout.write('\n[2/8] Seeding Categories...')
        cat_defs = [
            ('Fashion & Clothing', 'fashion-clothing'),
            ('Electronics',        'electronics'),
            ('Home & Living',      'home-living'),
            ('Sports & Fitness',   'sports-fitness'),
            ('Food & Grocery',     'food-grocery'),
            ('Books & Education',  'books-education'),
            ('Beauty & Skincare',  'beauty-skincare'),
            ('Toys & Kids',        'toys-kids'),
        ]
        cat_map = {}
        for name, slug in cat_defs:
            cat = Category.objects.filter(slug=slug).first()
            if not cat:
                cat = Category.objects.create(name=name, slug=slug, is_active=True,
                                              description='Shop ' + name)
            cat_map[slug] = cat
        self.stdout.write(self.style.SUCCESS('    Done: 8 Categories'))

        # ── 3. Products ────────────────────────────────────────
        self.stdout.write('\n[3/8] Seeding 20 Products...')
        from django.utils.text import slugify
        import time
        products_created = 0
        all_products = []

        for p in DEMO_PRODUCTS:
            existing = Product.objects.filter(sku=p['sku']).first()
            if existing:
                all_products.append(existing)
                continue
            vendor = random.choice(vendors)
            cat = cat_map.get(p['cat'], list(cat_map.values())[0])
            slug = slugify(p['title']) + '-' + str(int(time.time() * 1000) % 99999)

            prod = Product.objects.create(
                title=p['title'], slug=slug,
                description='Premium quality ' + p['title'] + '. Fast delivery across Pakistan.',
                price=Decimal(str(p['price'])),
                discount_price=Decimal(str(p['dp'])),
                discount_type='FIXED',
                discount_value=Decimal(str(p['price'] - p['dp'])),
                is_tax_included=True, currency='PKR',
                stock=p['stock'], min_stock=10, stock_status='IN_STOCK',
                sku=p['sku'], brand=p.get('brand', ''),
                category=cat, vendor=vendor,
                tag=p.get('tag', ''),
                highlight_featured=(p.get('tag') in ['featured', 'bestseller']),
                is_active=True,
            )
            all_products.append(prod)
            products_created += 1

        self.stdout.write(self.style.SUCCESS(
            '    Done: ' + str(products_created) + ' new products created (total: ' + str(len(all_products)) + ')'
        ))

        # ── 4. Customer Orders ─────────────────────────────────
        self.stdout.write('\n[4/8] Seeding 25 Customer Orders (17% GST)...')
        if all_products and customers:
            order_statuses = ['pending', 'processing', 'shipped', 'delivered', 'delivered']
            payment_methods = ['JazzCash', 'EasyPaisa', 'CreditCard', 'COD', 'BankTransfer']
            cities = ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan']
            orders_count = 0

            for _ in range(25):
                customer = random.choice(customers)
                selected = random.sample(all_products, random.randint(1, 4))
                order_total = Decimal('0')
                items_data = []

                for prod in selected:
                    qty = random.randint(1, 3)
                    unit_price = float(str(prod.discount_price or prod.price))
                    line_total = Decimal(str(unit_price)) * qty
                    order_total += line_total
                    items_data.append({
                        'product_id': prod.id,
                        'product_title': prod.title,
                        'quantity': qty,
                        'price': d128(unit_price),
                        'line_total': d128(float(line_total)),
                    })

                tax = order_total * Decimal('0.17')
                shipping = Decimal('200') if order_total < Decimal('3000') else Decimal('0')
                grand = order_total + tax + shipping
                status = random.choice(order_statuses)
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
                    'shipping_address': 'House #' + str(random.randint(1, 500)) + ', Block ' + random.choice('ABCDEFG') + ', ' + city,
                    'created_at': created_at, 'updated_at': created_at,
                    'notes': 'Demo order',
                })
                for item in items_data:
                    iid = ObjectId()
                    db['orders_orderitem'].insert_one({'_id': iid, 'id': iid, 'order_id': order_id, **item})
                orders_count += 1

            self.stdout.write(self.style.SUCCESS('    Done: ' + str(orders_count) + ' orders with tax & shipping'))

        # ── 5. Vendor Bulk Orders + Delivery ───────────────────
        self.stdout.write('\n[5/8] Seeding Vendor Bulk Orders + Delivery...')
        bulk_count = 0
        for vendor in vendors:
            for _ in range(3):
                selected = random.sample(all_products, random.randint(2, 4))
                bulk_total = Decimal('0')
                order_id = ObjectId()
                created_at = datetime.now() - timedelta(days=random.randint(1, 60))
                status = random.choice(['pending', 'processing', 'approved', 'shipped', 'delivered'])

                db['orders_vendorbulkorder'].insert_one({
                    '_id': order_id, 'id': order_id,
                    'vendor_id': vendor.id, 'status': status,
                    'total_amount': d128(0),
                    'notes': 'Demo bulk order from ' + vendor.first_name,
                    'created_at': created_at, 'updated_at': created_at,
                })
                for prod in selected:
                    qty = random.randint(50, 300)
                    wholesale = float(str(prod.price)) * 0.6
                    line = Decimal(str(wholesale)) * qty
                    bulk_total += line
                    iid = ObjectId()
                    db['orders_vendorbulkorderitem'].insert_one({
                        '_id': iid, 'id': iid,
                        'bulk_order_id': order_id,
                        'master_product_id': prod.id,
                        'product_title': prod.title,
                        'quantity': qty, 'price': d128(wholesale),
                        'line_total': d128(float(line)),
                    })
                db['orders_vendorbulkorder'].update_one(
                    {'_id': order_id}, {'$set': {'total_amount': d128(float(bulk_total))}}
                )
                if status in ['shipped', 'delivered'] and riders:
                    rider = random.choice(riders)
                    did = ObjectId()
                    db['delivery_assignments'].insert_one({
                        '_id': did, 'bulk_order_id': order_id,
                        'vendor_id': vendor.id,
                        'delivery_person_id': rider.id,
                        'delivery_person_name': rider.first_name + ' ' + rider.last_name,
                        'delivery_person_email': rider.email,
                        'status': status, 'assigned_at': created_at,
                        'delivered_at': created_at + timedelta(days=3) if status == 'delivered' else None,
                    })
                bulk_count += 1

        self.stdout.write(self.style.SUCCESS('    Done: ' + str(bulk_count) + ' bulk orders + delivery'))

        # ── 6. Marketing ───────────────────────────────────────
        self.stdout.write('\n[6/8] Seeding Marketing...')
        mkt = 0
        for c in [
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
        ]:
            if not Campaign.objects.filter(name=c['name']).exists():
                Campaign.objects.create(**c); mkt += 1

        for p in [
            dict(name='Eid Mega Sale - 30% Off', type='percentage', discount='30%',
                 status='active', usage_limit=5000, redeemed=1823,
                 start_date=date.today()-timedelta(5), end_date=date.today()+timedelta(10)),
            dict(name='Free Shipping PKR 3000+', type='shipping', discount='Free Shipping',
                 status='active', usage_limit=10000, redeemed=4521,
                 start_date=date.today()-timedelta(30), end_date=date.today()+timedelta(60)),
            dict(name='New Customer PKR 500 Off', type='fixed', discount='PKR 500',
                 status='active', usage_limit=2000, redeemed=398,
                 start_date=date.today()-timedelta(7), end_date=date.today()+timedelta(30)),
        ]:
            if not Promotion.objects.filter(name=p['name']).exists():
                Promotion.objects.create(**p); mkt += 1

        for c in [
            dict(code='EID30', discount='30% Off', min_purchase=Decimal('2000'),
                 valid_from=date.today()-timedelta(5), valid_until=date.today()+timedelta(10), status='active'),
            dict(code='SAVE500', discount='PKR 500 Off', min_purchase=Decimal('3000'),
                 valid_from=date.today()-timedelta(2), valid_until=date.today()+timedelta(28), status='active'),
            dict(code='WELCOME20', discount='20% Off', min_purchase=Decimal('1000'),
                 valid_from=date.today()-timedelta(30), valid_until=date.today()+timedelta(60), status='active'),
            dict(code='FREESHIP', discount='Free Shipping', min_purchase=Decimal('1500'),
                 valid_from=date.today()-timedelta(15), valid_until=date.today()+timedelta(15), status='active'),
        ]:
            if not Coupon.objects.filter(code=c['code']).exists():
                Coupon.objects.create(**c); mkt += 1

        for a in [
            dict(campaign_name='Eid Fashion Sale', platform='facebook', status='active',
                 spend=Decimal('18500'), impressions=250000, clicks=12400, roas=Decimal('3.8')),
            dict(campaign_name='Summer Electronics', platform='google', status='active',
                 spend=Decimal('25000'), impressions=180000, clicks=9200, roas=Decimal('4.2')),
            dict(campaign_name='Flash Sale 24hrs', platform='tiktok', status='paused',
                 spend=Decimal('8000'), impressions=95000, clicks=5800, roas=Decimal('2.9')),
        ]:
            if not Ad.objects.filter(campaign_name=a['campaign_name']).exists():
                Ad.objects.create(**a); mkt += 1

        self.stdout.write(self.style.SUCCESS('    Done: ' + str(mkt) + ' marketing records'))

        # ── 7. Settings ────────────────────────────────────────
        self.stdout.write('\n[7/8] Seeding Payment Gateways & Tax Regions...')
        stg = 0
        for g in [
            dict(name='JazzCash', provider='PMCL', transaction_fee='2.5%', success_rate=Decimal('97.2'), status='active'),
            dict(name='EasyPaisa', provider='Telenor Microfinance', transaction_fee='2.0%', success_rate=Decimal('96.8'), status='active'),
            dict(name='HBL Credit Card', provider='HBL Bank', transaction_fee='3.0%', success_rate=Decimal('98.1'), status='active'),
            dict(name='Cash on Delivery', provider='In-House', transaction_fee='0%', success_rate=Decimal('99.9'), status='active'),
            dict(name='Bank Transfer', provider='SBP', transaction_fee='1.5%', success_rate=Decimal('99.5'), status='active'),
        ]:
            if not PaymentGateway.objects.filter(name=g['name']).exists():
                PaymentGateway.objects.create(**g); stg += 1

        for t in [
            dict(region='Federal GST Pakistan', tax_class='Standard', rate=Decimal('17.00'), is_compound=False, status='active'),
            dict(region='Punjab Sales Tax', tax_class='Services', rate=Decimal('16.00'), is_compound=False, status='active'),
            dict(region='Sindh Sales Tax', tax_class='Services', rate=Decimal('13.00'), is_compound=False, status='active'),
            dict(region='KPK Sales Tax', tax_class='Standard', rate=Decimal('15.00'), is_compound=False, status='active'),
            dict(region='Balochistan Sales Tax', tax_class='Standard', rate=Decimal('15.00'), is_compound=False, status='active'),
            dict(region='Export Zero Rated', tax_class='Zero Rate', rate=Decimal('0.00'), is_compound=False, status='active'),
        ]:
            if not TaxRegion.objects.filter(region=t['region']).exists():
                TaxRegion.objects.create(**t); stg += 1

        self.stdout.write(self.style.SUCCESS('    Done: ' + str(stg) + ' gateways & tax regions'))

        # ── 8. Financial Transactions ──────────────────────────
        self.stdout.write('\n[8/8] Seeding Financial Transactions...')
        orders_sample = list(db['orders_order'].find().sort('created_at', -1).limit(25))
        txn_count = 0
        for order in orders_sample:
            txn_id = ObjectId()
            db['finance_transaction'].insert_one({
                '_id': txn_id,
                'order_id': order.get('_id'),
                'amount': order.get('total_amount', d128(0)),
                'payment_method': order.get('payment_method', 'COD'),
                'status': 'success' if order.get('payment_status') == 'paid' else 'pending',
                'gateway_reference': 'TXN' + str(txn_id)[:10].upper(),
                'created_at': order.get('created_at', datetime.now()),
            })
            txn_count += 1

        self.stdout.write(self.style.SUCCESS('    Done: ' + str(txn_count) + ' transactions'))

        # ── Summary ────────────────────────────────────────────
        self.stdout.write('\n' + '=' * 56)
        self.stdout.write(self.style.SUCCESS('  ALL DEMO DATA SEEDED SUCCESSFULLY!'))
        self.stdout.write('=' * 56)
        self.stdout.write('\nLOGIN CREDENTIALS:')
        self.stdout.write('  Admin:    admin@nextgen.com    | Admin@123')
        self.stdout.write('  Vendor:   vendor1@store.com   | Vendor@123')
        self.stdout.write('  Customer: ali@gmail.com        | Customer@123')
        self.stdout.write('  Rider:    rider1@delivery.com  | Rider@123')
        self.stdout.write('=' * 56 + '\n')
