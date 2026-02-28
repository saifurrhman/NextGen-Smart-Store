import os
import django
import random
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from django.utils import timezone
from apps.products.models import Product
from apps.orders.models import Order, OrderItem
from apps.finance.models import Transaction
from apps.categories.models import Category
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_ecommerce_data():
    print("Seeding E-Commerce Data...")
    
    # Needs a User
    user, _ = User.objects.get_or_create(email='admin@example.com', defaults={'first_name': 'Admin', 'role': 'SUPER_ADMIN', 'is_active': True})
    
    cat_electronics = None
    cat_fashion = None
    cat_home = None
    
    # Products
    products_data = [
        {'title': 'Apple iPhone 15 Pro', 'price': 999.00, 'stock': 45, 'category': cat_electronics, 'vendor': None},
        {'title': 'Samsung Galaxy S24', 'price': 899.00, 'stock': 30, 'category': cat_electronics, 'vendor': None},
        {'title': 'Nike Air Jordan 1', 'price': 150.00, 'stock': 12, 'category': cat_fashion, 'vendor': None},
        {'title': 'Minimalist Desk Chair', 'price': 199.99, 'stock': 0, 'category': cat_home, 'vendor': None}, # Stock out
        {'title': 'Sony WH-1000XM5', 'price': 348.00, 'stock': 20, 'category': cat_electronics, 'vendor': None},
    ]
    
    products = []
    for pd in products_data:
        p, _ = Product.objects.get_or_create(title=pd['title'], defaults=pd)
        products.append(p)
    
    # Delete existing orders for clean slate
    Order.objects.all().delete()
    
    # Orders
    now = timezone.now()
    statuses = ['pending', 'processing', 'shipped', 'delivered', 'canceled']
    
    for i in range(1, 50):
        # random date in last 7 days
        days_ago = random.randint(0, 7)
        created_at = now - timedelta(days=days_ago, hours=random.randint(0, 23))
        
        status = random.choices(statuses, weights=[10, 10, 20, 50, 10])[0]
        
        order = Order.objects.create(
            user=None,
            status=status,
            total_amount=0 # calculated later
        )
        
        # Override auto_now_add for realistic data spread
        Order.objects.filter(id=order.id).update(created_at=created_at)
        
        # Order Items
        num_items = random.randint(1, 3)
        total_amount = 0
        for _ in range(num_items):
            product = random.choice(products)
            qty = random.randint(1, 2)
            price = product.price
            total_amount += (qty * price)
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                price=price
            )
            
        order.total_amount = total_amount
        order.save()
        
        # Payment Transaction
        txn_status = 'success' if status in ['processing', 'shipped', 'delivered'] else 'pending'
        if status == 'canceled':
            txn_status = 'refunded'
            
        txn = Transaction.objects.create(
            order=order,
            amount=total_amount,
            status=txn_status
        )
        Transaction.objects.filter(id=txn.id).update(created_at=created_at)
        
    print("Seed Complete! Created Realistic E-Commerce Database")

if __name__ == '__main__':
    seed_ecommerce_data()
