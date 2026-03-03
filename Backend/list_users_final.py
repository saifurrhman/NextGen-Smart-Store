import requests

try:
    # Assuming the server is on port 8000
    # We might need an auth token, but let's try to see if any public endpoint or if we can get it
    # Actually, without a token, this might fail.
    # Let's try to just list the users using a script that works with django.setup() correctly.
    
    import os
    import django
    import sys

    # Use absolute path to backend
    backend_path = os.path.abspath(".")
    sys.path.append(backend_path)
    # The correct settings path based on project structure
    os.environ['DJANGO_SETTINGS_MODULE'] = 'NextGenSmartStore.settings.development'
    django.setup()

    from django.contrib.auth import get_user_model
    User = get_user_model()

    print("--- User List from DB ---")
    users = list(User.objects.all())
    if not users:
        print("No users found in database.")
    for u in users:
        is_delivery = u.role == 'DELIVERY'
        marker = ">>> " if is_delivery else "    "
        print(f"{marker}ID: {u.id} | Email: {u.email} | Role: {u.role}")
    print("-------------------------")

except Exception as e:
    print(f"Error: {e}")
