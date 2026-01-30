"""
Settings package for NextGenSmartStore
"""
import os

# Determine which settings to use
environment = os.getenv('DJANGO_ENVIRONMENT', 'development')

if environment == 'production':
    from .production import *
elif environment == 'testing':
    from .testing import *
else:
    from .development import *
