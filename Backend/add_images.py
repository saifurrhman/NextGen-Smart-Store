import os
import sys
import django
import shutil

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from core.utils import get_mongo_db

def update_images():
    # Paths to the generated artifacts
    tshirt_src = r"C:\Users\SAIF UR REHMAN\.gemini\antigravity\brain\961c9496-04c8-415c-a9ee-fdf0cbbb9c13\nike_tshirt_1778323257265.png"
    shoes_src = r"C:\Users\SAIF UR REHMAN\.gemini\antigravity\brain\961c9496-04c8-415c-a9ee-fdf0cbbb9c13\jordan_shoes_1778323281677.png"
    
    # Target media directory
    media_dir = os.path.join(os.path.dirname(__file__), 'media', 'products', 'main')
    os.makedirs(media_dir, exist_ok=True)
    
    # Destination paths
    tshirt_dest_filename = 'nike_tshirt_seeded.png'
    shoes_dest_filename = 'jordan_shoes_seeded.png'
    tshirt_dest = os.path.join(media_dir, tshirt_dest_filename)
    shoes_dest = os.path.join(media_dir, shoes_dest_filename)
    
    # Copy files
    shutil.copy2(tshirt_src, tshirt_dest)
    shutil.copy2(shoes_src, shoes_dest)
    
    # Update Database
    db = get_mongo_db()
    
    # Update T-shirt
    db['products_product'].update_one(
        {'slug': 'nike-dri-fit'},
        {'$set': {'main_image': f'products/main/{tshirt_dest_filename}'}}
    )
    
    # Update Shoes
    db['products_product'].update_one(
        {'slug': 'jordan-1-high'},
        {'$set': {'main_image': f'products/main/{shoes_dest_filename}'}}
    )
    
    print("DONE: Images copied and database updated successfully!")

if __name__ == '__main__':
    update_images()
