from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, VendorDashboardStatsView, VendorProductsListView, VendorOrdersListView

router = DefaultRouter()
router.register(r'', VendorViewSet, basename='vendors')

urlpatterns = [
    path('dashboard/', VendorDashboardStatsView.as_view(), name='vendor-dashboard'),
    path('products/', VendorProductsListView.as_view(), name='vendor-products'),
    path('orders/', VendorOrdersListView.as_view(), name='vendor-orders'),
    path('', include(router.urls)),
]
