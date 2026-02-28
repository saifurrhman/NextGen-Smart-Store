from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeliveryViewSet, DailyOperationsView

router = DefaultRouter()
router.register(r'delivery', DeliveryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('daily-stats/', DailyOperationsView.as_view(), name='daily-stats'),
]
