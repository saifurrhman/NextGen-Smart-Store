import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.categories.models import Category

def clear_categories():
    print("Clearing all categories...")
    count, _ = Category.objects.all().delete()
    print(f"Deleted {count} categories.")
    print("Database cleared.")

if __name__ == '__main__':
    clear_categories()
