"""
Production settings for Vercel deployment
"""
from .base import *
import os

DEBUG = False

# Vercel domains
ALLOWED_HOSTS = [
    '.vercel.app',
    'nextgensmartstore-backend.vercel.app',
    'nextgensmartstore-backend-git-main-saifriaz34-8874s-projects.vercel.app',
    'localhost',
    '127.0.0.1',
]

# Security settings
SECURE_SSL_REDIRECT = False  # Vercel handles SSL
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF = True

# Static files with WhiteNoise
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# CORS - Update with your frontend URL later
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend.vercel.app',  # Update this later
    'http://localhost:5173',
    'http://localhost:3000',
]

CORS_ALLOW_ALL_ORIGINS = True  # For testing only, remove in production

# Database - MongoDB Atlas
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': os.getenv('MONGO_DB_NAME', 'nextgen_smart_store'),
        'ENFORCE_SCHEMA': False,
        'CLIENT': {
            'host': os.getenv('MONGO_URI', 'mongodb://localhost:27017/'),
        }
    }
}

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
