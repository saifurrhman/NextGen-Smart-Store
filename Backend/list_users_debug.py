import os
import django
import sys

# Add the backend directory to sys.path
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("--- Current Users in Database ---")
for u in User.objects.all():
    print(f"ID: {u.id} | Email: {u.email} | Name: {u.first_name} {u.last_name} | Role: {u.role}")
print("---------------------------------")
