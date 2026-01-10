from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorProductViewSet, VendorOrderViewSet

router = DefaultRouter()
router.register(r'products', VendorProductViewSet, basename='vendor-products')
router.register(r'sales', VendorOrderViewSet, basename='vendor-sales')

urlpatterns = [
    path('', include(router.urls)),
]
