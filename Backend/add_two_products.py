import os
import sys
import django
import json
from datetime import datetime

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from core.utils import get_mongo_db
from bson import ObjectId

def seed_two_products():
    db = get_mongo_db()
    
    # 1. Add Categories
    tshirt_cat_id = ObjectId()
    shoes_cat_id = ObjectId()
    
    db['categories_category'].insert_many([
        {'_id': tshirt_cat_id, 'name': 'T-Shirts', 'slug': 't-shirts', 'description': 'Premium T-Shirts', 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()},
        {'_id': shoes_cat_id, 'name': 'Shoes', 'slug': 'shoes', 'description': 'Fashion Footwear', 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()}
    ])
    
    # 2. Add Attributes
    color_attr_id = ObjectId()
    shoe_size_attr_id = ObjectId()
    clothing_size_attr_id = ObjectId()
    
    db['attributes_attribute'].insert_many([
        {'_id': color_attr_id, 'name': 'Color', 'slug': 'color', 'terms': 'Black, White, Red, Blue', 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()},
        {'_id': shoe_size_attr_id, 'name': 'Shoe Size', 'slug': 'shoe_size', 'terms': '39, 40, 41, 42, 43, 44', 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()},
        {'_id': clothing_size_attr_id, 'name': 'Clothing Size', 'slug': 'clothing_size', 'terms': 'S, M, L, XL', 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()}
    ])
    
    # 3. Add Products
    tshirt_prod_id = ObjectId()
    shoes_prod_id = ObjectId()
    
    db['products_product'].insert_many([
        {
            '_id': tshirt_prod_id,
            'title': 'Nike Dri-FIT Sports T-Shirt',
            'slug': 'nike-dri-fit-sports-t-shirt',
            'description': 'Stay dry, stay focused. The Nike Dri-FIT T-Shirt features sweat-wicking fabric for comfort during your hardest workouts.',
            'price': '25.00',
            'discount_price': '19.99',
            'discount_type': 'FIXED',
            'discount_value': '5.01',
            'is_tax_included': True,
            'currency': 'USD',
            'stock': 150,
            'min_stock': 10,
            'is_unlimited': False,
            'stock_status': 'IN_STOCK',
            'sku': 'TSH-NK-DF-01',
            'brand': 'Nike',
            'material': '100% Polyester',
            'colors_data': json.dumps(['#000000', '#FFFFFF', '#FF0000']),
            'sizes_data': json.dumps(['M', 'L', 'XL']),
            'features': json.dumps(['Sweat-wicking', 'Lightweight', 'Breathable']),
            'category_id': tshirt_cat_id,
            'is_active': True,
            'created_at': datetime.now(),
            'updated_at': datetime.now(),
        },
        {
            '_id': shoes_prod_id,
            'title': 'Air Jordan 1 High OG',
            'slug': 'air-jordan-1-high-og',
            'description': 'The Air Jordan 1 High OG is the shoe that started it all. Premium leather, iconic design, and maximum comfort.',
            'price': '180.00',
            'discount_price': None,
            'discount_type': 'NONE',
            'discount_value': '0',
            'is_tax_included': True,
            'currency': 'USD',
            'stock': 45,
            'min_stock': 5,
            'is_unlimited': False,
            'stock_status': 'IN_STOCK',
            'sku': 'SH-AJ1-OG-BL',
            'brand': 'Jordan',
            'material': 'Premium Leather',
            'colors_data': json.dumps(['#000000', '#FF0000', '#FFFFFF']),
            'sizes_data': json.dumps(['40', '41', '42', '43']),
            'features': json.dumps(['Air-Sole unit', 'Solid rubber outsole', 'Premium materials']),
            'category_id': shoes_cat_id,
            'is_active': True,
            'created_at': datetime.now(),
            'updated_at': datetime.now(),
        }
    ])
    
    # 4. Link Attributes to Products (ManyToManyField in Django uses a junction table or array)
    # Django ManyToMany creates a table: products_product_attributes
    # with columns: id, product_id, attribute_id
    db['products_product_attributes'].insert_many([
        {'_id': ObjectId(), 'product_id': tshirt_prod_id, 'attribute_id': color_attr_id},
        {'_id': ObjectId(), 'product_id': tshirt_prod_id, 'attribute_id': clothing_size_attr_id},
        {'_id': ObjectId(), 'product_id': shoes_prod_id, 'attribute_id': color_attr_id},
        {'_id': ObjectId(), 'product_id': shoes_prod_id, 'attribute_id': shoe_size_attr_id},
    ])
    
    print("SUCCESS: 2 Products (T-Shirt & Shoes) along with Categories and Attributes have been added successfully!")

if __name__ == '__main__':
    seed_two_products()
