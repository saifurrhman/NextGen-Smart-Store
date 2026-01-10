from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .vendor_views import VendorOrderViewSet

router = DefaultRouter()
router.register(r'orders', VendorOrderViewSet, basename='vendor-orders')

urlpatterns = [
    path('', include(router.urls)),
]
