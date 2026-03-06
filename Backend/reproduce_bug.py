import os
import django
import sys

# Set up Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def test_exists():
    print("Testing User.objects.filter(email='saifurrehman7726@gmail.com').exists()...")
    try:
        exists = User.objects.filter(email='saifurrehman7726@gmail.com').exists()
        print(f"Result: {exists}")
    except Exception as e:
        print(f"Error caught: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_exists()
