from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, VendorDashboardStatsView, VendorProductsListView, VendorProductDetailView, VendorOrdersListView, VendorEarningsView, VendorReviewsView, VendorGalleryImageDeleteView

router = DefaultRouter()
router.register(r'', VendorViewSet, basename='vendors')

urlpatterns = [
    path('dashboard/', VendorDashboardStatsView.as_view(), name='vendor-dashboard'),
    path('products/', VendorProductsListView.as_view(), name='vendor-products'),
    path('products/<str:pk>/', VendorProductDetailView.as_view(), name='vendor-product-detail'),
    path('orders/', VendorOrdersListView.as_view(), name='vendor-orders'),
    path('earnings/', VendorEarningsView.as_view(), name='vendor-earnings'),
    path('reviews/', VendorReviewsView.as_view(), name='vendor-reviews'),
    path('products/gallery/<str:pk>/', VendorGalleryImageDeleteView.as_view(), name='vendor-product-gallery-delete'),
    path('', include(router.urls)),
]
