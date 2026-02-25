import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.categories.models import Category

def seed_categories():
    categories = [
        {
            'name': 'Electronics',
            'description': 'Gadgets and devices',
            'icon': 'smartphone'
        },
        {
            'name': 'Fashion',
            'description': 'Clothing and accessories',
            'icon': 'checkroom'
        },
        {
            'name': 'Home & Living',
            'description': 'Furniture and decor',
            'icon': 'chair'
        }
    ]

    print("Seeding categories...")
    for cat_data in categories:
        cat, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={
                'description': cat_data['description'],
                'is_active': True
                # icon field might need a file or string depending on model, assuming string/charfield or skipping if ImageField
            }
        )
        if created:
            print(f"Created: {cat.name}")
        else:
            print(f"Already exists: {cat.name}")

    print("Seeding complete.")

if __name__ == '__main__':
    seed_categories()
