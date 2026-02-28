from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, PayoutViewSet

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transactions')
router.register(r'payouts', PayoutViewSet, basename='payouts')

urlpatterns = [
    path('', include(router.urls)),
]
