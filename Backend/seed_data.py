import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.base')
django.setup()

from apps.categories.models import Category
from apps.attributes.models import Attribute
from apps.products.models import Product, ProductImage
from django.contrib.auth import get_user_model

User = get_user_model()

def seed():
    print("Starting seed script...")
    
    # 1. Get a vendor (first user)
    vendor = User.objects.first()
    if not vendor:
        print("No users found. Please create a user first.")
        return
    
    # 2. Categories
    categories_data = [
        {'name': "Men's Fashion", 'description': "Latest trends in men's apparel"},
        {'name': "Electronics", 'description': "Gadgets, watches and more"},
        {'name': "Footwear", 'description': "Shoes, sneakers and boots"}
    ]
    
    cat_objs = {}
    for cat_info in categories_data:
        cat, created = Category.objects.get_or_create(name=cat_info['name'], defaults={'description': cat_info['description']})
        cat_objs[cat.name] = cat
        print(f"Category {'created' if created else 'found'}: {cat.name}")

    # 3. Attributes
    # Colors
    color_terms = "White:#FFFFFF,Black:#000000,Red:#FF0000,Blue:#0000FF,Green:#008000"
    color_attr, created = Attribute.objects.get_or_create(name='Color', defaults={'terms': color_terms})
    if not created:
        color_attr.terms = color_terms
        color_attr.save()
    print("Color attribute setup.")

    # Sizes
    size_terms = "S,M,L,XL,XXL"
    size_attr, created = Attribute.objects.get_or_create(name='Size', defaults={'terms': size_terms})
    if not created:
        size_attr.terms = size_terms
        size_attr.save()
    print("Size attribute setup.")

    # 4. Products
    products_data = [
        {
            'title': "Classic Blue T-Shirt",
            'description': "A premium minimalist blue cotton t-shirt. Comfortable and breathable, perfect for everyday wear.",
            'price': 1500,
            'category': cat_objs["Men's Fashion"],
            'main_image': 'products/main/blue-tshirt.png',
            'sku': 'TSHRT-BLU-001',
            'brand': 'NextGen Basic',
            'material': '100% Cotton',
            'features': ['Premium Cotton', 'Regular Fit', 'Machine Washable'],
            'colors': ['#0000FF', '#FFFFFF'], # Blue, White
            'sizes': ['S', 'M', 'L', 'XL']
        },
        {
            'title': "Modern Smart Watch",
            'description': "Sleek modern black smartwatch with a silicone strap and vibrant digital display. Tracks health and notifications.",
            'price': 8500,
            'category': cat_objs["Electronics"],
            'main_image': 'products/main/smart-watch.png',
            'sku': 'WATCH-SMT-002',
            'brand': 'NextGen Tech',
            'material': 'Silicone & Aluminum',
            'features': ['Heart Rate Monitor', 'GPS Tracking', '7-Day Battery Life', 'Water Resistant'],
            'colors': ['#000000'], # Black
            'sizes': ['One Size']
        },
        {
            'title': "Red Pro Running Sneakers",
            'description': "Vibrant red professional running sneakers. Breathable mesh and responsive sole for maximum performance.",
            'price': 4500,
            'category': cat_objs["Footwear"],
            'main_image': 'products/main/red-sneakers.png',
            'sku': 'SHOE-RED-003',
            'brand': 'NextGen Sports',
            'material': 'Synthetic Mesh',
            'features': ['Lightweight', 'Responsive Cushioning', 'Durable Sole'],
            'colors': ['#FF0000', '#000000'], # Red, Black
            'sizes': ['38', '40', '42', '44']
        }
    ]

    for p_data in products_data:
        # Delete existing to re-create with hex colors
        Product.objects.filter(sku=p_data['sku']).delete()

        p = Product.objects.create(
            title=p_data['title'],
            description=p_data['description'],
            price=p_data['price'],
            category_id=p_data['category'].id, # Use ID directly
            main_image=p_data['main_image'],
            sku=p_data['sku'],
            brand=p_data['brand'],
            material=p_data['material'],
            features=json.dumps(p_data['features']),
            colors_data=json.dumps(p_data['colors']), 
            sizes_data=json.dumps(p_data['sizes']),
            vendor_id=vendor.id, # Use ID directly
            is_active=True
        )
        p.attributes.add(color_attr, size_attr)
        print(f"Created product: {p.title}")

    print("Seeding complete!")

if __name__ == '__main__':
    seed()
