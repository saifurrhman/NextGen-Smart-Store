import os
import sys

path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.append(path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.production')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

app = application
