import os
import django
import sys
from django.contrib.auth import get_user_model

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

User = get_user_model()
email = 'admin@nextgenstore.com'
password = 'admin1234'

if not User.objects.filter(email=email).exists():
    print(f"Creating superuser {email}")
    User.objects.create_superuser(username='admin', email=email, password=password, first_name='Admin', last_name='User')
    print("Superuser created successfully.")
else:
    print(f"Superuser {email} already exists")
