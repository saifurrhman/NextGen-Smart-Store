"""
URL configuration for NextGenSmartStore project
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Swagger/OpenAPI Schema (wrapped to avoid drf_yasg compatibility issues)
try:
    from rest_framework import permissions
    from drf_yasg.views import get_schema_view
    from drf_yasg import openapi

    schema_view = get_schema_view(
        openapi.Info(
            title="Next-Gen Smart Store API",
            default_version='v1',
            description="AI-powered luxury e-commerce platform with AR/VR capabilities",
            terms_of_service="https://www.nextgenstore.com/terms/",
            contact=openapi.Contact(email="contact@nextgenstore.com"),
            license=openapi.License(name="Proprietary License"),
        ),
        public=True,
        permission_classes=(permissions.AllowAny,),
    )
    _swagger_available = True
except Exception:
    _swagger_available = False

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include('api.v1.urls')),
]

# API Documentation (only if drf_yasg loaded successfully)
if _swagger_available:
    urlpatterns += [
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
        path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    ]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
