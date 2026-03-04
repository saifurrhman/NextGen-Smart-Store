import os
import django
import sys
from django.core.files import File
from decimal import Decimal

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings')
django.setup()

from apps.products.models import Product, ProductImage
from apps.categories.models import Category
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_everything():
    print("Seeding categories and premium products...")
    
    # Get or create a vendor
    vendor = User.objects.filter(role='VENDOR').first()
    if not vendor:
        vendor = User.objects.filter(role='SUPER_ADMIN').first()
        if not vendor:
             vendor = User.objects.create_superuser(email='admin@demo.com', password='password123', username='admin')
    
    # Seed Categories
    cat_names = ["Electronics", "Fashion", "Home & Living", "Beauty", "Sports"]
    category_objs = []
    for name in cat_names:
        cat, _ = Category.objects.get_or_create(name=name)
        category_objs.append(cat)
    
    demo_products = [
        {
            "title": "iPhone 15 Pro Max",
            "description": "The peak of performance with A17 Pro chip and titanium design. Features an advanced triple-lens camera system with 5x optical zoom and a stunning Super Retina XDR display.",
            "price": Decimal("1199.00"),
            "discount_price": Decimal("1099.00"),
            "discount_type": "FIXED",
            "discount_value": Decimal("100.00"),
            "stock": 50,
            "sku": "IPH-15-PRO-MAX",
            "tag": "TRENDING",
            "highlight_featured": True,
            "stock_status": "IN_STOCK",
            "category": category_objs[0]
        },
        {
            "title": "MacBook Air M3",
            "description": "Strikingly thin and fast, so you can work, play or create anywhere. The M3 chip brings even more capability to the world's most popular laptop, with up to 18 hours of battery life.",
            "price": Decimal("1299.00"),
            "discount_price": Decimal("1199.00"),
            "discount_type": "PERCENTAGE",
            "discount_value": Decimal("10.00"),
            "stock": 30,
            "sku": "MAC-AIR-M3",
            "tag": "NEW",
            "highlight_featured": True,
            "stock_status": "IN_STOCK",
            "category": category_objs[0]
        },
        {
            "title": "Sony WH-1000XM5",
            "description": "Industry leading noise canceling headphones with exceptional sound. From airplane noise to people’s voices, our WH-1000XM5 wireless headphones with multiple microphone noise canceling keep out more high and mid frequency sounds than ever.",
            "price": Decimal("399.00"),
            "discount_price": Decimal("349.00"),
            "discount_type": "FIXED",
            "discount_value": Decimal("50.00"),
            "stock": 100,
            "sku": "SONY-XM5",
            "tag": "BEST_SELLER",
            "highlight_featured": False,
            "stock_status": "IN_STOCK",
            "category": category_objs[0]
        },
        {
            "title": "Samsung S24 Ultra",
            "description": "Unlock a new era of AI-integrated mobile experience. Scale up your productivity with Galaxy AI, featuring Live Translate, Note Assist and Photo Assist.",
            "price": Decimal("1299.00"),
            "discount_price": Decimal("1149.00"),
            "discount_type": "PERCENTAGE",
            "discount_value": Decimal("12.00"),
            "stock": 40,
            "sku": "SAM-S24-ULTRA",
            "tag": "TRENDING",
            "highlight_featured": True,
            "stock_status": "IN_STOCK",
            "category": category_objs[0]
        },
        {
            "title": "Dell XPS 15",
            "description": "The perfect balance of power and portability for creators. Experience stunning visuals on the 15.6-inch InfinityEdge display with up to 3.5K OLED resolution.",
            "price": Decimal("1499.00"),
            "discount_price": Decimal("1399.00"),
            "discount_type": "FIXED",
            "discount_value": Decimal("100.00"),
            "stock": 20,
            "sku": "DELL-XPS-15",
            "tag": "NEW",
            "highlight_featured": False,
            "stock_status": "OUT_OF_STOCK",
            "category": category_objs[0]
        }
    ]

    for p_data in demo_products:
        product, created = Product.objects.update_or_create(
            sku=p_data['sku'],
            defaults={
                **p_data,
                "vendor": vendor
            }
        )
        if created:
            print(f"Created product: {product.title}")
        else:
            print(f"Updated product: {product.title}")

if __name__ == "__main__":
    seed_everything()
