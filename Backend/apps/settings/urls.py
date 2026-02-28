from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentGatewayViewSet, TaxRegionViewSet

router = DefaultRouter()
router.register(r'payment-gateways', PaymentGatewayViewSet)
router.register(r'tax-regions', TaxRegionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
