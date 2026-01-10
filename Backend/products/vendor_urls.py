from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .vendor_views import VendorProductViewSet

router = DefaultRouter()
router.register(r'products', VendorProductViewSet, basename='vendor-products')

urlpatterns = [
    path('', include(router.urls)),
]
