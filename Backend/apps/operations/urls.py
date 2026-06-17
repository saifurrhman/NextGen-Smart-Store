from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeliveryViewSet, DailyStatsLogViewSet, InventoryAlertsView
from .seed_view import seed_demo_data

router = DefaultRouter()
router.register(r'delivery', DeliveryViewSet)
router.register(r'daily-stats', DailyStatsLogViewSet, basename='daily-stats')

urlpatterns = [
    path('', include(router.urls)),
    path('inventory-alerts/', InventoryAlertsView.as_view(), name='inventory-alerts'),
    path('seed-demo/', seed_demo_data, name='seed-demo-data'),
]
