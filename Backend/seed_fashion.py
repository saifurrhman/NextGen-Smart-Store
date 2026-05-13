import os
import sys
import django
import json
import random

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.categories.models import Category
from apps.products.models import Product, ProductImage
from core.utils import get_mongo_db

def seed_fashion():
    print("Starting Fashion Seeding with 360 Gallery...")
    
    # 1. Create Categories
    category_names = ["Men's Fashion", "Women's Fashion", "Footwear", "Accessories", "Outerwear"]
    categories = {}
    for name in category_names:
        cat = Category.objects.filter(name=name).first()
        if not cat:
            cat = Category.objects.create(name=name)
        cat.save()
        categories[name] = cat

    # 2. Fashion Product Data with multiple images for 360
    products_data = [
        {
            "title": "Air Max Infinity Sneakers",
            "category": "Footwear",
            "price": 149.00,
            "discount_price": 129.00,
            "description": "Step into the future with the Air Max Infinity. Featuring an ultralight mesh upper and an oversized Max Air unit for unparalleled comfort and bounce. The sleek dark silhouette pairs perfectly with any techwear or street style outfit.",
            "features": ["Max Air Cushioning", "Breathable Mesh Upper", "Reflective Detailing", "Rubber Waffle Outsole"],
            "colors": ["#ef4444", "#000000", "#ffffff"],
            "sizes": ["US 8", "US 9", "US 10", "US 11", "US 12"],
            "brand": "Nike",
            "images": [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", # Red profile
                "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop", # Top view/angle
                "https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?q=80&w=800&auto=format&fit=crop", # Other angle
                "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop", # Sole/bottom
            ]
        },
        {
            "title": "Chronos Automatic Watch",
            "category": "Accessories",
            "price": 499.00,
            "discount_price": None,
            "description": "Precision engineering meets timeless design. The Chronos Automatic features a visible tourbillon movement, sapphire crystal glass, and a genuine Italian leather strap. Water resistant up to 50 meters.",
            "features": ["Automatic Movement", "Sapphire Crystal Glass", "Italian Leather Strap", "5 ATM Water Resistance"],
            "colors": ["#000000", "#78350f"],
            "sizes": ["One Size"],
            "brand": "Chronos",
            "images": [
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", # Face
                "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop", # Angle
                "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=800&auto=format&fit=crop", # Strap detail
                "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=800&auto=format&fit=crop", # Macro
            ]
        },
        {
            "title": "Obsidian Leather Biker Jacket",
            "category": "Outerwear",
            "price": 299.00,
            "discount_price": 249.00,
            "description": "A modern take on the classic rebel staple. The Obsidian jacket is crafted from 100% premium full-grain lambskin leather. It features asymmetrical zips, quilted shoulder panels, and a sleek matte finish.",
            "features": ["100% Full-Grain Leather", "Asymmetrical Zipper", "Quilted Shoulders", "Satin Lining"],
            "colors": ["#000000"],
            "sizes": ["S", "M", "L", "XL"],
            "brand": "Obsidian",
            "images": [
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop", # Front
                "https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop", # Texture/Side
                "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop", # Lifestyle
            ]
        },
        {
            "title": "Essential Heavyweight T-Shirt",
            "category": "Men's Fashion",
            "price": 45.00,
            "discount_price": 35.00,
            "description": "Your new everyday go-to. This heavyweight 100% organic cotton t-shirt offers a relaxed, boxy fit with dropped shoulders. Preshrunk to ensure a perfect fit wash after wash.",
            "features": ["100% Organic Cotton", "Heavyweight 220 GSM", "Boxy Fit", "Pre-shrunk"],
            "colors": ["#ffffff", "#000000", "#9ca3af"],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "brand": "Essentials",
            "images": [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", # Front
                "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop", # Folded
            ]
        },
        {
            "title": "Vanguard Snapback Cap",
            "category": "Accessories",
            "price": 35.00,
            "discount_price": None,
            "description": "Top off your fit. The Vanguard cap features a structured 6-panel design, embroidered logo, and an adjustable snap closure for a custom fit. Perfect for sunny days or completing a streetwear look.",
            "features": ["Structured 6-Panel", "Embroidered Logo", "Adjustable Snap", "Breathable Eyelets"],
            "colors": ["#111827", "#b91c1c"],
            "sizes": ["One Size"],
            "brand": "Vanguard",
            "images": [
                "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop", # Front
                "https://images.unsplash.com/photo-1556306535-0f09a536f01f?q=80&w=800&auto=format&fit=crop", # Side/Other cap
                "https://images.unsplash.com/photo-1533827432537-70133748f5c8?q=80&w=800&auto=format&fit=crop", # Lifestyle
            ]
        }
    ]

    # 3. Insert/Update Products
    db = get_mongo_db()
    for p_data in products_data:
        cat = categories[p_data['category']]
        
        product, created = Product.objects.update_or_create(
            title=p_data['title'],
            defaults={
                'category': cat,
                'price': p_data['price'],
                'discount_price': p_data['discount_price'],
                'description': p_data['description'],
                'features': json.dumps(p_data['features']),
                'colors_data': json.dumps(p_data['colors']),
                'sizes_data': json.dumps(p_data['sizes']),
                'brand': p_data['brand'],
                'stock': random.randint(20, 100),
                'is_active': True,
            }
        )
        
        # Insert Main Image directly into MongoDB
        main_img_url = p_data['images'][0]
        db['products_product'].update_one(
            {'slug': product.slug},
            {'$set': {'main_image': main_img_url}}
        )

        # Clear existing gallery images for this product (if re-running)
        db['products_productimage'].delete_many({'product_id': product.id})
        
        # Insert Gallery Images directly into MongoDB
        # Django uses `image` field which usually stores a path, but we force the URL
        for idx, img_url in enumerate(p_data['images']):
            # Create a mock ProductImage via Django ORM to get an ID, then overwrite via Mongo
            pi = ProductImage.objects.create(product=product)
            db['products_productimage'].update_one(
                {'_id': pi.id},
                {'$set': {'image': img_url}}
            )

        print(f"[{'NEW' if created else 'UPD'}] {product.title} (Added {len(p_data['images'])} images for 360 gallery)")

    print("\nFashion Seed Completed Successfully! Products are now ready for the 360 viewer.")

if __name__ == '__main__':
    seed_fashion()
