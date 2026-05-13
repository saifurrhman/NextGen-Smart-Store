import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from django.apps import apps

apps_to_inspect = ['marketing', 'finance', 'content', 'reviews', 'support', 'orders', 'products', 'users', 'categories', 'cart']

with open('model_inspection.txt', 'w') as f:
    for app_label in apps_to_inspect:
        try:
            app_config = apps.get_app_config(app_label)
            f.write(f"--- APP: {app_label} ---\n")
            for model in app_config.get_models():
                f.write(f"Model: {model.__name__}\n")
                for field in model._meta.get_fields():
                    f.write(f"  Field: {field.name} ({field.__class__.__name__})\n")
        except Exception as e:
            f.write(f"Failed to inspect {app_label}: {e}\n")
