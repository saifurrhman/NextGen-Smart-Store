from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeliveryViewSet, DailyStatsLogViewSet, InventoryAlertsView

router = DefaultRouter()
router.register(r'delivery', DeliveryViewSet)
router.register(r'daily-stats', DailyStatsLogViewSet, basename='daily-stats')

urlpatterns = [
    path('', include(router.urls)),
    path('inventory-alerts/', InventoryAlertsView.as_view(), name='inventory-alerts'),
]
