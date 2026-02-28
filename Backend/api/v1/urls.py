"""
API v1 URL Configuration
"""
from django.urls import path, include

urlpatterns = [
    # Authentication
    path('auth/', include('apps.authentication.urls')),
    
    # Users
    path('users/', include('apps.users.urls')),
    
    # Products
    path('products/', include('apps.products.urls')),
    path('categories/', include('apps.categories.urls')),
    path('brands/', include('apps.brands.urls')),
    path('attributes/', include('apps.attributes.urls')),
    
    # Shopping
    path('cart/', include('apps.cart.urls')),
    path('orders/', include('apps.orders.urls')),
    
    # Vendors
    path('vendors/', include('apps.vendors.urls')),
    
    # Reviews & Ratings
    path('reviews/', include('apps.reviews.urls')),
    
    # AR Assets
    path('ar-assets/', include('apps.ar_assets.urls')),
    
    # Recommendations
    path('recommendations/', include('apps.recommendations.urls')),
    
    # Analytics
    path('analytics/', include('apps.analytics.urls')),
    
    # Content
    path('content/', include('apps.content.urls')),
    
    # Finance
    path('finance/', include('apps.finance.urls')),
    
    # Marketing
    path('marketing/', include('apps.marketing.urls')),
    
    # Operations
    path('operations/', include('apps.operations.urls')),
    
    # Support
    path('support/', include('apps.support.urls')),
    
    # Notifications
    path('notifications/', include('apps.notifications.urls')),
    
    # Media Library
    path('media/', include('apps.media_library.urls')),
    
    # AI Automation
    path('ai-automation/', include('apps.ai_automation.urls')),
    
    # Settings
    path('settings/', include('apps.settings.urls')),
]
