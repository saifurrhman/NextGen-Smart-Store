import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from core.utils import get_mongo_db
from bson import ObjectId

def fix():
    db = get_mongo_db()
    db['products_product_attributes'].delete_many({})
    
    t_prod = list(db['products_product'].find({'slug': 'nike-dri-fit'}))[0]['_id']
    s_prod = list(db['products_product'].find({'slug': 'jordan-1-high'}))[0]['_id']
    
    attrs = list(db['attributes_attribute'].find())
    c_attr = [a['_id'] for a in attrs if a['slug'] == 'color'][0]
    cs_attr = [a['_id'] for a in attrs if a['slug'] == 'clothing_size'][0]
    ss_attr = [a['_id'] for a in attrs if a['slug'] == 'shoe_size'][0]
    
    id1, id2, id3, id4 = ObjectId(), ObjectId(), ObjectId(), ObjectId()
    
    db['products_product_attributes'].insert_many([
        {'_id': id1, 'id': id1, 'product_id': t_prod, 'attribute_id': c_attr},
        {'_id': id2, 'id': id2, 'product_id': t_prod, 'attribute_id': cs_attr},
        {'_id': id3, 'id': id3, 'product_id': s_prod, 'attribute_id': c_attr},
        {'_id': id4, 'id': id4, 'product_id': s_prod, 'attribute_id': ss_attr}
    ])
    print('DONE')

if __name__ == '__main__':
    fix()
