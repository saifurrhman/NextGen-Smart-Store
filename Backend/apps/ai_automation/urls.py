from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AIActivityLogViewSet, AISystemStatusViewSet, AIDashboardStatsViewSet

router = DefaultRouter()
router.register(r'logs', AIActivityLogViewSet)
router.register(r'status', AISystemStatusViewSet)
router.register(r'stats', AIDashboardStatsViewSet, basename='ai-stats')

urlpatterns = [
    path('', include(router.urls)),
]
