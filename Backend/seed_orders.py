import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.orders.models import Order, OrderItem
from apps.users.models import User
from apps.products.models import Product

def seed_orders():
    # Get or create a customer
    customer, _ = User.objects.get_or_create(
        email='customer@example.com',
        defaults={'username': 'customer', 'role': 'customer'}
    )
    
    # Get or create some products
    products = Product.objects.all()
    if not products.exists():
        # Create some if none exist
        products = [
            Product.objects.create(title='Elegant Shirt', price=45.00, stock=100),
            Product.objects.create(title='Leather Wallet', price=25.00, stock=50),
            Product.objects.create(title='Dumbbell Set', price=80.00, stock=20),
            Product.objects.create(title='Premium Coffee', price=15.00, stock=200),
        ]
    
    statuses = ['pending', 'processing', 'shipped', 'delivered', 'canceled']
    
    for i in range(25):
        days_ago = random.randint(0, 14)
        order_date = timezone.now() - timedelta(days=days_ago)
        
        order = Order.objects.create(
            user=customer,
            status=random.choice(statuses),
            total_amount=0,
            shipping_address="123 Street, City",
            payment_status='paid'
        )
        order.created_at = order_date
        order.save()
        
        # Add random items
        num_items = random.randint(1, 3)
        total_amount = 0
        added_products = random.sample(list(products), k=num_items)
        
        for product in added_products:
            quantity = random.randint(1, 2)
            price = product.price
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price
            )
            total_amount += price * quantity
        
        order.total_amount = total_amount
        order.save()

    print(f"Successfully seeded {Order.objects.count()} orders.")

if __name__ == "__main__":
    seed_orders()
