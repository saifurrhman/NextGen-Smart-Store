import os
import django
import sys

# Setup Django
backend_path = os.path.abspath(".")
sys.path.append(backend_path)
os.environ['DJANGO_SETTINGS_MODULE'] = 'NextGenSmartStore.settings.development'
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = "delivery@nextgen.com"
password = "Password786"
role = "DELIVERY"

if User.objects.filter(email=email).exists():
    user = User.objects.get(email=email)
    user.role = role
    user.set_password(password)
    user.save()
    print(f"Updated existing user: {email} with role: {role}")
else:
    user = User.objects.create_user(
        email=email,
        username=email,
        password=password,
        role=role
    )
    print(f"Created new delivery user: {email}")

print(f"Credentials:\nEmail: {email}\nPassword: {password}")
