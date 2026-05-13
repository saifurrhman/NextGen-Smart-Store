import os
import django
import sys
import random
import string
from datetime import datetime
from decimal import Decimal

# Setup Django
sys.path.append('.')
os.environ['DJANGO_SETTINGS_MODULE'] = 'NextGenSmartStore.settings.development'
django.setup()

from core.utils import get_mongo_db

def random_sku_part():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))

def seed_pymongo():
    print("🚀 Starting Premium Catalog Seeding (PyMongo Final)...")
    db = get_mongo_db()
    
    # 1. Map Category Names to IDs
    categories = {}
    cat_names = ["Footwear", "Electronics", "Men's Fashion"]
    for name in cat_names:
        cat = db['categories_category'].find_one({'name': name})
        if not cat:
            print(f"Creating category {name}...")
            # Use name-based slug
            slug = name.lower().replace(' ', '-').replace("'", "")
            res = db['categories_category'].insert_one({
                'name': name,
                'slug': slug,
                'is_active': True,
                'created_at': datetime.now(),
                'updated_at': datetime.now()
            })
            cat_id = res.inserted_id
        else:
            cat_id = cat['_id']
            print(f"   - Found Category: {name}")
        
        categories[name] = cat_id
        print(f"   - Category Mapped: {name} (ID: {cat_id})")

    # 2. Products Definition
    products_to_seed = [
        {
            'title': 'Stealth Runner Pro',
            'category': 'Footwear',
            'price': 12500,
            'image': 'products/main/stealth_runner_pro.png',
            'desc': 'High-tech breathable mesh running shoes with 360° airflow system and ultra-responsive cushioning for peak performance.',
            'stock': 500
        },
        {
            'title': 'Urban Street Leather',
            'category': 'Footwear',
            'price': 18900,
            'image': 'products/main/urban_street_leather.png',
            'desc': 'Handcrafted Italian leather street shoes featuring a minimalist luxury design and durable vulcanized rubber soles.',
            'stock': 350
        },
        {
            'title': 'Trail Blazer X1',
            'category': 'Footwear',
            'price': 14200,
            'image': 'products/main/trail_blazer_x1.png',
            'desc': 'Aggressive all-terrain trail shoes with reinforced toe protection and high-traction diamond lugs for extreme hiking.',
            'stock': 420
        },
        {
            'title': 'Midnight Quartz Edition',
            'category': "Men's Fashion",
            'price': 24500,
            'image': 'products/main/midnight_quartz.png',
            'desc': 'Sophisticated luxury watch featuring a sapphire crystal dial, obsidian black finish, and precision Swiss quartz movement.',
            'stock': 150
        },
        {
            'title': 'Cyber-Titan Smartwatch',
            'category': 'Electronics',
            'price': 32000,
            'image': 'products/main/cyber_titan_smart.png',
            'desc': 'Next-gen smartwatch with 360° rotating UI, titanium alloy body, AMOLED display, and health tracking suite.',
            'stock': 280
        },
        {
            'title': 'Classic Chrono Gold',
            'category': "Men's Fashion",
            'price': 45000,
            'image': 'products/main/classic_chrono_gold.png',
            'desc': 'Heritage-inspired gold-tone chronograph with genuine alligator leather strap and triple-subdial precision movement.',
            'stock': 95
        },
        {
            'title': 'Arctic Fleece Parka',
            'category': "Men's Fashion",
            'price': 15500,
            'image': 'products/main/arctic_fleece_parka.png',
            'desc': 'Heavyweight insulated winter parka with water-resistant shell and thermal-lock technology for extreme cold conditions.',
            'stock': 200
        },
        {
            'title': 'Slim-Fit Silk Shirt',
            'category': "Men's Fashion",
            'price': 8900,
            'image': 'products/main/slim_fit_silk_shirt.png',
            'desc': 'Premium mulberry silk button-down shirt with a natural sheen and tailored slim-fit design for elegant evenings.',
            'stock': 300
        },
        {
            'title': 'Raw Indigo Denim',
            'category': "Men's Fashion",
            'price': 7500,
            'image': 'products/main/raw_indigo_denim.png',
            'desc': 'High-durability raw indigo denim jeans with reinforced double-stitch construction and a modern tapered fit.',
            'stock': 600
        },
        {
            'title': 'GORE-TEX Tech Cap',
            'category': "Men's Fashion",
            'price': 4200,
            'image': 'products/main/stealth_waterproof_cap.png',
            'desc': 'Advanced technical cap made with authentic GORE-TEX waterproof membrane, perfect for outdoor urban exploration.',
            'stock': 450
        },
        {
            'title': 'Heritage Wool Beanie',
            'category': "Men's Fashion",
            'price': 2800,
            'image': 'products/main/heritage_wool_beanie.png',
            'desc': 'Warm 100% Merino wool knit beanie with high-density fibers and an ribbed texture for ultimate comfort.',
            'stock': 550
        }
    ]

    # Get the actual max numeric 'id'
    last_id = (db['products_product'].find_one(sort=[("id", -1)]) or {}).get('id', 100) or 100

    for p in products_to_seed:
        if db['products_product'].find_one({'title': p['title']}):
            print(f"   - Skipping {p['title']} (exists)")
            continue
            
        last_id += 1
        product_doc = {
            'id': int(last_id),
            'title': p['title'],
            'slug': p['title'].lower().replace(' ', '-').replace('--', '-').replace("'", ""),
            'description': p['desc'],
            'price': str(p['price']),
            'stock': int(p['stock']),
            'min_stock': 10,
            'category_id': categories[p['category']],
            'currency': 'PKR',
            'main_image': p['image'],
            'sku': f"NGS-{p['title'][:3].upper()}-{random_sku_part()}",
            'is_active': True,
            'created_at': datetime.now(),
            'updated_at': datetime.now(),
            'stock_status': 'IN_STOCK',
            'is_tax_included': True,
            'discount_type': 'NONE',
            'discount_value': "0.00",
            'highlight_featured': False,
            'is_unlimited': False,
            'tag': None,
            'vendor_id': None
        }
        
        db['products_product'].insert_one(product_doc)
        print(f"   ✅ Seeded: {p['title']} (ID: {last_id})")

if __name__ == "__main__":
    seed_pymongo()
