import os
import django
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from django.contrib.auth import authenticate, get_user_model

User = get_user_model()
email = 'admin@nextgenstore.com'
password = 'admin1234'

print(f"--- Login Debugging ---")
print(f"USERNAME_FIELD: {User.USERNAME_FIELD}")
print(f"Attempting login with Email: {email} | Password: {password}")

# 1. Check if user exists directly
try:
    print("Checking by username='admin'...")
    user_obj = User.objects.get(username='admin')
    print(f"[SUCCESS] User found via User.objects.get(username='admin')")
    print(f"  - Username: '{user_obj.username}'")
    print(f"  - Email: '{user_obj.email}'")
    print(f"  - Is Active: {user_obj.is_active}")
    print(f"  - Check Password: {user_obj.check_password(password)}")
    
    # Update email if missing
    if user_obj.email != email:
        print(f"Updating email from '{user_obj.email}' to '{email}'...")
        user_obj.email = email
        user_obj.save()
        print("Email updated.")

except User.DoesNotExist:
    print(f"[FAIL] User with username 'admin' DOES NOT EXIST.")

try:
    user_obj = User.objects.get(email=email)
    print(f"[SUCCESS] User found via User.objects.get(email='{email}')")
except Exception as e:
    print(f"[FAIL] User lookup by email '{email}' failed: {e}")

# 2. Test authenticate()
print(f"\nAttempting authenticate()...")
# Note: Since USERNAME_FIELD is 'email', we pass 'email' as the 'username' kwarg?
# Or do we pass it as 'email'?
# Django's ModelBackend expects the key to match USERNAME_FIELD if not specified? 
# Authenticate usually takes credentials=kwargs.
user = authenticate(email=email, password=password) 

if user:
    print(f"[SUCCESS] authenticate(email=...) returned User: {user}")
else:
    print(f"[FAIL] authenticate(email=...) returned None.")
    # Try with 'username' kwarg just in case
    print("Retrying authenticate with username=kwargs...")
    user = authenticate(username=email, password=password)
    if user:
         print(f"[SUCCESS] authenticate(username=...) returned User: {user}")
    else:
         print(f"[FAIL] authenticate(username=...) also returned None.")
