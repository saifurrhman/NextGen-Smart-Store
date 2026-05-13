import os
import sys
import django
from datetime import datetime

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from core.utils import get_mongo_db
from bson import ObjectId

def seed():
    db = get_mongo_db()
    db['categories_category'].delete_many({})
    db['attributes_attribute'].delete_many({})
    db['products_product'].delete_many({})
    
    t_cat, s_cat = ObjectId(), ObjectId()
    db['categories_category'].insert_many([
        {'_id': t_cat, 'id': t_cat, 'name': 'T-Shirts', 'slug': 't-shirts', 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()}, 
        {'_id': s_cat, 'id': s_cat, 'name': 'Shoes', 'slug': 'shoes', 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()}
    ])
    
    c_attr, ss_attr, cs_attr = ObjectId(), ObjectId(), ObjectId()
    db['attributes_attribute'].insert_many([
        {'_id': c_attr, 'id': c_attr, 'name': 'Color', 'slug': 'color', 'terms': 'Black, White', 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()}, 
        {'_id': ss_attr, 'id': ss_attr, 'name': 'Shoe Size', 'slug': 'shoe_size', 'terms': '40, 41', 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()}, 
        {'_id': cs_attr, 'id': cs_attr, 'name': 'Clothing Size', 'slug': 'clothing_size', 'terms': 'M, L', 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()}
    ])
    
    t_prod, s_prod = ObjectId(), ObjectId()
    db['products_product'].insert_many([
        {'_id': t_prod, 'id': t_prod, 'title': 'Nike Dri-FIT T-Shirt', 'slug': 'nike-dri-fit', 'price': '25.00', 'stock': 150, 'category_id': t_cat, 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()}, 
        {'_id': s_prod, 'id': s_prod, 'title': 'Jordan 1 High', 'slug': 'jordan-1-high', 'price': '180.00', 'stock': 45, 'category_id': s_cat, 'is_active': True, 'created_at': datetime.now(), 'updated_at': datetime.now()}
    ])
    
    db['products_product_attributes'].insert_many([
        {'_id': ObjectId(), 'product_id': t_prod, 'attribute_id': c_attr}, 
        {'_id': ObjectId(), 'product_id': t_prod, 'attribute_id': cs_attr}, 
        {'_id': ObjectId(), 'product_id': s_prod, 'attribute_id': c_attr}, 
        {'_id': ObjectId(), 'product_id': s_prod, 'attribute_id': ss_attr}
    ])
    print('DONE')

if __name__ == '__main__':
    seed()
