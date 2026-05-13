import os
import django
import random
from datetime import timedelta
from decimal import Decimal

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from django.utils import timezone
from faker import Faker
from django.contrib.auth import get_user_model
from apps.categories.models import Category
from apps.products.models import Product
from apps.marketing.models import Campaign, Promotion, Coupon, Ad
from apps.finance.models import Transaction, Payout, FinancialReport
from apps.support.models import Ticket, KnowledgeBaseArticle, ChatSession
from apps.orders.models import Order, OrderItem, VendorBulkOrder, VendorBulkOrderItem
from bson import ObjectId

User = get_user_model()
fake = Faker()

def create_users():
    print("Creating users...")
    users = []
    
    # 1. Super Admin
    if not User.objects.filter(email='admin@demo.com').exists():
        admin = User.objects.create_superuser('admin@demo.com', 'admin123', first_name='Super', last_name='Admin')
    else:
        admin = User.objects.get(email='admin@demo.com')
        
    # 2. Vendors
    vendors = []
    for i in range(3):
        email = f'vendor{i}@demo.com'
        if not User.objects.filter(email=email).exists():
            v = User.objects.create_user(email, 'vendor123', first_name=fake.first_name(), last_name=fake.last_name(), role='VENDOR', is_active=True)
            vendors.append(v)
        else:
            vendors.append(User.objects.get(email=email))
            
    # 3. Customers
    customers = []
    for i in range(10):
        email = f'customer{i}@demo.com'
        if not User.objects.filter(email=email).exists():
            c = User.objects.create_user(email, 'customer123', first_name=fake.first_name(), last_name=fake.last_name(), role='CUSTOMER', is_active=True)
            customers.append(c)
        else:
            customers.append(User.objects.get(email=email))
            
    print(f"Verified/Created 1 Admin, {len(vendors)} Vendors, and {len(customers)} Customers.")
    return admin, vendors, customers

def create_categories():
    print("Creating categories...")
    cat_names = ["Electronics", "Fashion", "Home & Kitchen", "Books", "Sports", "Beauty", "Automotive", "Toys", "Health"]
    categories = []
    for name in cat_names:
        cat, created = Category.objects.get_or_create(name=name, defaults={'description': fake.text(max_nb_chars=100), 'is_active': True})
        categories.append(cat)
    print(f"Created/Verified {len(categories)} categories.")
    return categories

def create_products(categories, vendors, num_products=25):
    print(f"Creating {num_products} products...")
    words = ["Smart", "Pro", "Max", "Ultra", "Lite", "Advanced", "Digital", "Wireless", "Portable", "Premium"]
    items = ["Phone", "Watch", "Laptop", "Headphones", "Speaker", "Charger", "Camera", "Tablet", "Monitor", "Keyboard"]
    
    products = []
    for _ in range(num_products):
        title = f"{random.choice(words)} {random.choice(items)} {random.randint(1, 99)}"
        # Ensure unique slugs manually since slugification can conflict occasionally
        slug = fake.slug() + str(random.randint(100, 9999))
        price = Decimal(random.uniform(50.0, 1500.0)).quantize(Decimal('0.01'))
        
        is_discounted = random.choice([True, False])
        discount_price = price - Decimal(random.uniform(5.0, 40.0)).quantize(Decimal('0.01')) if is_discounted else None
        
        prod_cat = random.choice(categories)
        prod_vendor = random.choice(vendors)
        
        try:
            prod = Product.objects.create(
                title=title,
                slug=slug,
                description=fake.text(max_nb_chars=300),
                price=price,
                discount_price=discount_price,
                stock=random.randint(5, 500),
                category=prod_cat,
                vendor=prod_vendor,
                is_active=True,
                currency='PKR'
            )
            products.append(prod)
        except Exception as e:
            print(f"Error creating product {title}: {e}")
            
    print(f"Successfully created {len(products)} products.")
    return products

def create_marketing_data():
    print("Creating marketing mock data (Campaigns, Promotions, Coupons, Ads)...")
    
    # Campaigns
    for _ in range(5):
        Campaign.objects.create(
            name=fake.catch_phrase(),
            status=random.choice(["Active", "Paused", "Completed"]),
            budget=Decimal(random.uniform(100, 5000)).quantize(Decimal('0.01')),
            spent=Decimal(random.uniform(10, 1000)).quantize(Decimal('0.01')),
            start_date=timezone.now().date() - timedelta(days=random.randint(5, 30)),
            end_date=timezone.now().date() + timedelta(days=random.randint(5, 30))
        )
        
    # Coupons
    for _ in range(5):
        Coupon.objects.create(
            code=fake.word().upper() + str(random.randint(10, 99)),
            discount=f"{random.randint(5, 30)}%",
            min_purchase=Decimal(random.uniform(50, 500)).quantize(Decimal('0.01')),
            valid_from=timezone.now().date() - timedelta(days=random.randint(1, 10)),
            valid_until=timezone.now().date() + timedelta(days=random.randint(10, 50)),
            status=random.choice(["Active", "Expired"])
        )
        
    # Ads
    for _ in range(8):
        Ad.objects.create(
            campaign_name=fake.company(),
            platform=random.choice(["Facebook", "Google Ads", "Instagram", "TikTok"]),
            status=random.choice(["Active", "Paused"]),
            spend=Decimal(random.uniform(50, 800)).quantize(Decimal('0.01')),
            impressions=random.randint(1000, 50000),
            clicks=random.randint(50, 2000),
            roas=Decimal(random.uniform(1.1, 4.5)).quantize(Decimal('0.01'))
        )
    print("Marketing data created.")

def create_support_data(customers, super_admin):
    print("Creating support mock data (Tickets, KnowledgeBase, ChatSessions)...")
    
    # KnowledgeBase
    for _ in range(6):
        KnowledgeBaseArticle.objects.create(
            title=fake.sentence(),
            category=random.choice(["Order Issues", "Account Setup", "Refunds", "General"]),
            content=fake.paragraphs(nb=3)
        )
        
    # Tickets
    for _ in range(10):
        cust = random.choice(customers)
        Ticket.objects.create(
            user=cust,
            subject=fake.sentence(nb_words=4),
            description=fake.text(),
            status=random.choice(["Open", "In Progress", "Closed"]),
            priority=random.choice(["Low", "Medium", "High", "Urgent"]),
            assigned_to=super_admin
        )
        
    print("Support data created.")

def create_orders_and_finance(customers, vendors, products):
    print("Creating Orders, Transactions, and Bulk Orders...")
    
    for i in range(15):
        cust = random.choice(customers)
        order_prods = random.sample(products, k=random.randint(1, 4))
        
        total = sum([p.price for p in order_prods])
        
        # 1. Order
        order = Order.objects.create(
            user=cust,
            status=random.choice(["Pending", "Processing", "Shipped", "Delivered"]),
            total_amount=total
        )
        
        # 2. Order Items
        for p in order_prods:
            qty = random.randint(1, 3)
            OrderItem.objects.create(
                order=order,
                product=p,
                quantity=qty,
                price=p.price
            )
            
        # 3. Transaction
        Transaction.objects.create(
            order=order,
            amount=total,
            status=random.choice(["Completed", "Pending", "Failed"]),
            payment_method=random.choice(["Credit Card", "PayPal", "Bank Transfer"])
        )
        
    # Vendor Bulk Orders
    for v in vendors:
        v_prods = random.sample(products, k=random.randint(1, 3))
        total_bulk = sum([p.price * 10 for p in v_prods])
        
        b_order = VendorBulkOrder.objects.create(
            vendor=v,
            status=random.choice(["pending", "approved", "shipped"]),
            total_amount=total_bulk
        )
        
        for p in v_prods:
            VendorBulkOrderItem.objects.create(
                bulk_order=b_order,
                master_product=p,
                quantity=random.randint(10, 50),
                price=p.price
            )
            
    print("Orders and finance data created.")

def run():
    print("--- STARTING DUMMY DATA SEEDING ---")
    admin, vendors, customers = create_users()
    categories = create_categories()
    products = create_products(categories, vendors, num_products=30)
    
    create_marketing_data()
    create_support_data(customers, admin)
    create_orders_and_finance(customers, vendors, products)
    
    print("--- DUMMY DATA SEEDING COMPLETED SUCCESSFULLY! ---")

if __name__ == '__main__':
    run()
