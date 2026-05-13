"""
Demo Product Adder — iPhone 17 Pro Max
Run this from the Backend folder:
    python add_iphone_demo.py
"""
import os
import sys
import django
import shutil
import json
from pathlib import Path

# ── Django Setup ──────────────────────────────────────────────────────────────
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.core.files import File
from apps.products.models import Product, ProductImage
from apps.categories.models import Category

# ── Image Paths ───────────────────────────────────────────────────────────────
BASE = Path(r"C:\Users\SAIF UR REHMAN\.gemini\antigravity\brain\30b05a72-0ae4-44a1-a765-6a9e562d4707")
IMAGES = {
    'main':   BASE / "iphone17_front_1775670177273.png",
    'frame1': BASE / "iphone17_front_1775670177273.png",
    'frame2': BASE / "iphone17_angle45_1775670255371.png",
    'frame3': BASE / "iphone17_left_1775670212095.png",
    'frame4': BASE / "iphone17_back45_1775670272574.png",
    'frame5': BASE / "iphone17_back_1775670194597.png",
    'frame6': BASE / "iphone17_right_1775670227729.png",
}

# ── Check images exist ────────────────────────────────────────────────────────
print("🔍 Checking image files...")
for name, path in IMAGES.items():
    status = "✅" if path.exists() else "❌ MISSING"
    print(f"  {status}  {name}: {path.name}")

missing = [k for k, v in IMAGES.items() if not v.exists()]
if missing:
    print(f"\n❌ Missing images: {missing}")
    print("   Please ensure the image files exist at the specified paths.")
    sys.exit(1)

print("\n✅ All images found!")

# ── Delete old demo product if exists ────────────────────────────────────────
old = Product.objects.filter(title__icontains="iPhone 17 Pro Max").first()
if old:
    print(f"\n🗑️  Removing existing demo product: {old.title}")
    old.delete()

# ── Get or find category ──────────────────────────────────────────────────────
category_id = None
for name in ['Smartphones', 'Electronics', 'Mobile', 'Phone', 'Mobiles']:
    cat = Category.objects.filter(name__icontains=name).first()
    if cat:
        category_id = cat.pk
        print(f"\n📂 Category found: {cat.name} (id={category_id})")
        break

if not category_id:
    print("\n📂 No existing category found — creating 'Smartphones'")
    try:
        from django.utils.text import slugify
        # Check if slug already exists
        slug = 'smartphones'
        if Category.objects.filter(slug=slug).exists():
            slug = 'smartphones-phones'
        cat = Category.objects.create(
            name='Smartphones',
            slug=slug,
            description='Latest smartphones and mobile devices'
        )
        category_id = cat.pk
        print(f"   ✅ Created category: Smartphones (id={category_id})")
    except Exception as e:
        print(f"   ⚠️  Could not create category: {e}")
        category_id = None

# ── Create Product ────────────────────────────────────────────────────────────
print("\n📦 Creating iPhone 17 Pro Max product...")

features = json.dumps([
    "6.9-inch Super Retina XDR ProMotion display",
    "A19 Pro chip — fastest mobile processor ever",
    "200MP Triple Camera System with 8K Video",
    "48-hour all-day battery life",
    "Aerospace-grade Titanium build",
    "iOS 19 with Apple Intelligence AI features",
    "USB-C with Thunderbolt 5 speeds",
    "ProRes video recording in 8K"
])

colors_data = json.dumps(["#C0B5A1", "#2C2C2E", "#E8E0D5", "#4A4A50"])

sizes_data = json.dumps(["128GB", "256GB", "512GB", "1TB"])

try:
    product = Product(
        title="iPhone 17 Pro Max",
        description=(
            "Experience the pinnacle of smartphone innovation. The iPhone 17 Pro Max features "
            "a stunning 6.9\" Super Retina XDR ProMotion display running at 120Hz, powered by "
            "the all-new A19 Pro chip built on 2nm technology. Capture every moment with the "
            "revolutionary 200MP Triple Camera System supporting 8K video recording, optical "
            "zoom up to 10x, and advanced computational photography. The aerospace-grade "
            "titanium frame with textured matte glass back provides premium durability while "
            "keeping the device lightweight. With 48-hour battery life, USB-C Thunderbolt 5, "
            "and iOS 19 with Apple Intelligence — this is the most advanced iPhone ever created."
        ),
        price=1299.00,
        discount_price=1199.00,
        discount_type="FIXED",
        discount_value=100,
        is_tax_included=True,
        currency="USD",
        stock=50,
        min_stock=5,
        is_unlimited=False,
        stock_status="IN_STOCK",
        sku="APL-IP17PM-TIT-256",
        barcode="0194253389247",
        brand="Apple",
        weight="0.227",
        material="Titanium & Ceramic Shield",
        dimensions="16.3×7.77×0.84",
        features=features,
        colors_data=colors_data,
        sizes_data=sizes_data,
        tag="NEW",
        highlight_featured=True,
        is_active=True,
        category_id=category_id,
    )

    # Save main image
    with open(IMAGES['main'], 'rb') as f:
        product.main_image.save("iphone17_main.png", File(f), save=False)

    product.save()
    print(f"   ✅ Product created! ID: {product.pk}")

    # ── Add Gallery Images ────────────────────────────────────────────────────
    print("\n🖼️  Adding 360° gallery images...")
    gallery_keys = ['frame1', 'frame2', 'frame3', 'frame4', 'frame5', 'frame6']
    for i, key in enumerate(gallery_keys):
        with open(IMAGES[key], 'rb') as f:
            img = ProductImage(product=product)
            img.image.save(f"iphone17_frame{i+1}.png", File(f), save=True)
        print(f"   ✅ Frame {i+1}/6 added")

    print(f"\n{'='*55}")
    print(f"🎉 SUCCESS! iPhone 17 Pro Max added!")
    print(f"{'='*55}")
    print(f"  Product ID  : {product.pk}")
    print(f"  Title       : {product.title}")
    print(f"  Price       : ${product.price}")
    print(f"  Sale Price  : ${product.discount_price}")
    print(f"  Category    : ID {category_id}")
    print(f"  Gallery     : 6 frames (360° rotation ready)")
    print(f"  Status      : ACTIVE / FEATURED")
    print(f"\n👉 View in admin: http://localhost:3000/admin/products/all")
    print(f"👉 Test 360° in store: http://localhost:3000/products/{product.pk}")

except Exception as e:
    import traceback
    print(f"\n❌ Error creating product: {e}")
    traceback.print_exc()
