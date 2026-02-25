"""
Development settings
"""
from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '*']

# Development-specific apps
INSTALLED_APPS += [
    'django_extensions',
]

# CORS - Allow all in development
CORS_ALLOW_ALL_ORIGINS = True

# Email - Real SMTP for OTP (reads from .env via base.py)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Logging - More verbose in development
LOGGING['root']['level'] = 'DEBUG'
