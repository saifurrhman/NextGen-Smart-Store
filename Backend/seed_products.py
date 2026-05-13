import os
import sys
import django
import json
import random

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.categories.models import Category
from apps.products.models import Product
from core.utils import get_mongo_db

def seed_products():
    print("Starting Product Seeding...")
    
    # 1. Create Categories
    category_names = ['Electronics', 'Audio', 'Wearables', 'Peripherals', 'Accessories', 'Gadgets']
    categories = {}
    for name in category_names:
        cat, created = Category.objects.get_or_create(name=name)
        categories[name] = cat
        print(f"Category '{name}' ensured.")

    # 2. Product Data
    products_data = [
        {
            "title": "Quantum X Pro Smartphone",
            "category": "Electronics",
            "price": 999.00,
            "discount_price": 849.00,
            "description": "The ultimate smartphone experience with a revolutionary 120Hz OLED display, next-gen AI camera system, and ultra-fast charging capabilities. Crafted with aerospace-grade aluminum and protected by our toughest glass ever.",
            "features": ["120Hz OLED Display", "50MP AI Triple Camera", "5G Ready", "All-day Battery"],
            "colors": ["#000000", "#ffffff", "#10b981"],
            "sizes": ["128GB", "256GB", "512GB"],
            "brand": "Quantum",
            "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Nebula Noise-Canceling Headphones",
            "category": "Audio",
            "price": 349.00,
            "discount_price": 299.00,
            "description": "Immerse yourself in pure sound. The Nebula headphones feature industry-leading active noise cancellation, high-res audio certification, and up to 40 hours of continuous playback on a single charge.",
            "features": ["Active Noise Cancellation", "40-Hour Battery", "Multipoint Bluetooth", "Touch Controls"],
            "colors": ["#1f2937", "#f3f4f6"],
            "sizes": [],
            "brand": "SonicWave",
            "image_url": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Apex Smartwatch Ultra",
            "category": "Wearables",
            "price": 249.00,
            "discount_price": None,
            "description": "Your ultimate fitness companion and daily assistant. The Apex Ultra tracks your health metrics with precision, offers seamless notifications, and features a rugged, water-resistant titanium case.",
            "features": ["Heart Rate Monitor", "GPS Tracking", "Titanium Case", "Water Resistant 50m"],
            "colors": ["#000000", "#eab308"],
            "sizes": ["40mm", "44mm"],
            "brand": "Apex",
            "image_url": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Horizon 4K Gaming Monitor",
            "category": "Electronics",
            "price": 699.00,
            "discount_price": 599.00,
            "description": "Experience gaming like never before on this breathtaking 32-inch 4K UHD monitor. With a blistering 144Hz refresh rate, 1ms response time, and HDR600 support, every frame is flawlessly rendered.",
            "features": ["32-inch 4K UHD", "144Hz Refresh Rate", "1ms Response Time", "HDR600 Support"],
            "colors": ["#000000"],
            "sizes": ["27-inch", "32-inch"],
            "brand": "Horizon",
            "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Titan Mechanical Keyboard",
            "category": "Peripherals",
            "price": 149.00,
            "discount_price": 129.00,
            "description": "Precision engineering meets striking aesthetics. The Titan features hot-swappable linear switches, aircraft-grade aluminum top plate, and fully customizable per-key RGB lighting via our intuitive software.",
            "features": ["Hot-swappable Switches", "Per-key RGB", "Aluminum Frame", "PBT Keycaps"],
            "colors": ["#111827", "#f8fafc"],
            "sizes": ["TKL", "Full-size"],
            "brand": "Titan",
            "image_url": "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Stealth Wireless Mouse",
            "category": "Peripherals",
            "price": 89.00,
            "discount_price": None,
            "description": "Ultra-lightweight, ultra-fast. The Stealth mouse weighs only 65g and features a flawless 26K DPI optical sensor, ensuring absolute precision and speed for competitive gaming.",
            "features": ["65g Ultra-lightweight", "26K DPI Sensor", "100h Battery Life", "PTFE Feet"],
            "colors": ["#000000", "#ffffff"],
            "sizes": [],
            "brand": "Stealth",
            "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Echo Smart Speaker",
            "category": "Audio",
            "price": 129.00,
            "discount_price": 99.00,
            "description": "Fill your room with rich, 360-degree sound. The Echo integrates seamlessly with your smart home ecosystem, allowing you to control lights, thermostats, and music with just your voice.",
            "features": ["360-Degree Sound", "Voice Assistant Integrated", "Smart Home Hub", "Privacy Controls"],
            "colors": ["#1f2937", "#f3f4f6", "#3b82f6"],
            "sizes": [],
            "brand": "Echo",
            "image_url": "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Nova Studio Microphone",
            "category": "Audio",
            "price": 199.00,
            "discount_price": None,
            "description": "Professional-grade audio capture for podcasters and streamers. The Nova condenser microphone offers exceptional clarity, built-in pop filter, and plug-and-play USB connectivity.",
            "features": ["Condenser Capsule", "Cardioid Pattern", "Built-in Pop Filter", "USB-C Connectivity"],
            "colors": ["#000000"],
            "sizes": [],
            "brand": "Nova",
            "image_url": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Zenith Power Bank 20000mAh",
            "category": "Accessories",
            "price": 79.00,
            "discount_price": 59.00,
            "description": "Never run out of power. The Zenith high-capacity power bank features dual 65W USB-C PD ports, capable of charging laptops, tablets, and phones simultaneously.",
            "features": ["20000mAh Capacity", "65W USB-C PD", "Digital Display", "Airline Safe"],
            "colors": ["#0f172a"],
            "sizes": [],
            "brand": "Zenith",
            "image_url": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Aura RGB Desk Mat",
            "category": "Accessories",
            "price": 49.00,
            "discount_price": 39.00,
            "description": "Elevate your setup. The Aura mat provides an ultra-smooth micro-woven surface for precise mouse tracking, bordered by dynamic RGB lighting with 14 distinct lighting modes.",
            "features": ["Micro-woven Surface", "14 RGB Modes", "Non-slip Rubber Base", "Spill-resistant"],
            "colors": ["#000000"],
            "sizes": ["M", "L", "XL"],
            "brand": "Aura",
            "image_url": "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Orion Laptop Stand",
            "category": "Accessories",
            "price": 59.00,
            "discount_price": None,
            "description": "Improve your ergonomics and laptop cooling. The Orion is crafted from a single piece of premium solid aluminum, lifting your laptop to eye level for optimal posture.",
            "features": ["Ergonomic Design", "Solid Aluminum", "Cable Management", "Silicone Pads"],
            "colors": ["#9ca3af", "#1f2937"],
            "sizes": [],
            "brand": "Orion",
            "image_url": "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Pulse Fitness Tracker",
            "category": "Wearables",
            "price": 89.00,
            "discount_price": 69.00,
            "description": "Sleek, lightweight, and incredibly smart. The Pulse tracks your sleep, steps, and heart rate 24/7, with an impressive 14-day battery life.",
            "features": ["24/7 Heart Rate", "Sleep Tracking", "14-Day Battery", "OLED Touchscreen"],
            "colors": ["#10b981", "#000000", "#ec4899"],
            "sizes": ["Standard"],
            "brand": "Pulse",
            "image_url": "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Vortex Drone with 4K Camera",
            "category": "Gadgets",
            "price": 899.00,
            "discount_price": 799.00,
            "description": "Capture the world from above. The Vortex drone features a 3-axis gimbal, 4K 60fps video capture, intelligent obstacle avoidance, and up to 35 minutes of flight time.",
            "features": ["4K 60fps Camera", "3-Axis Gimbal", "Obstacle Avoidance", "35 Min Flight Time"],
            "colors": ["#f3f4f6"],
            "sizes": [],
            "brand": "Vortex",
            "image_url": "https://images.unsplash.com/photo-1507580461134-59b2e75e92b8?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Luminous Smart Bulb",
            "category": "Gadgets",
            "price": 29.00,
            "discount_price": 24.00,
            "description": "Transform your space with 16 million colors. The Luminous bulb connects directly to your WiFi, allowing you to set schedules, dim the lights, and sync with your music.",
            "features": ["16 Million Colors", "WiFi Connected", "Voice Control", "Music Sync"],
            "colors": [],
            "sizes": ["A19", "BR30"],
            "brand": "Luminous",
            "image_url": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop"
        },
        {
            "title": "Cipher Hardware Wallet",
            "category": "Gadgets",
            "price": 149.00,
            "discount_price": 129.00,
            "description": "Secure your digital assets. The Cipher hardware wallet utilizes a secure element chip and a custom OS to isolate your private keys, making it virtually impervious to remote attacks.",
            "features": ["Secure Element Chip", "Bluetooth Connectivity", "OLED Display", "Supports 5000+ Coins"],
            "colors": ["#111827"],
            "sizes": [],
            "brand": "Cipher",
            "image_url": "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop"
        }
    ]

    # 3. Insert/Update Products
    db = get_mongo_db()
    for p_data in products_data:
        cat = categories[p_data['category']]
        
        # Check if product exists to avoid massive duplicates on re-run
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
                'stock': random.randint(10, 150),
                'is_active': True,
            }
        )
        
        # 4. Inject image URL directly into MongoDB bypassing Django ImageField file validation
        if p_data['image_url']:
            db['products_product'].update_one(
                {'slug': product.slug},
                {'$set': {'main_image': p_data['image_url']}}
            )
            
        print(f"{'Created' if created else 'Updated'} Product: {product.title}")

    print("\n✅ Successfully seeded 15 premium products!")

if __name__ == '__main__':
    seed_products()
