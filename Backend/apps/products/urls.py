from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ProductRequestViewSet

router = DefaultRouter()
router.register('requests', ProductRequestViewSet, basename='product-request')
router.register('', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
