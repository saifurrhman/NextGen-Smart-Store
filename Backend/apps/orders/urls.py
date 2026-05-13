from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, RefundViewSet, OrderReportViewSet, VendorBulkOrderViewSet

router = DefaultRouter()
router.register(r'reports', OrderReportViewSet)
router.register(r'refunds', RefundViewSet)
router.register(r'bulk-orders', VendorBulkOrderViewSet, basename='bulk-orders')
router.register(r'', OrderViewSet, basename='orders')

urlpatterns = [
    path('', include(router.urls)),
]
