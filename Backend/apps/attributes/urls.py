from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttributeViewSet

router = DefaultRouter()
router.register('', AttributeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
