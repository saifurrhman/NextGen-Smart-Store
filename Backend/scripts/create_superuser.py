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

if not User.objects.filter(username='admin').exists():
    print(f"Creating superuser {email}")
    User.objects.create_superuser(username='admin', email=email, password=password, first_name='Admin', last_name='User')
    print("Superuser created successfully.")
else:
    print(f"Superuser 'admin' already exists. Resetting password...")
    u = User.objects.get(username='admin')
    u.set_password(password)
    u.save()
    print("Password reset successfully.")
