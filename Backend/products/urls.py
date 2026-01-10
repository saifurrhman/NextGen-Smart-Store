from django.urls import path
from .views import ProductPublicListView, ProductDetailView, CategoryListView, VendorProductCreateView

urlpatterns = [
    path('public/products/', ProductPublicListView.as_view(), name='public-product-list'),
    path('public/products/<slug:slug>/', ProductDetailView.as_view(), name='public-product-detail'),
    path('public/categories/', CategoryListView.as_view(), name='public-category-list'),
    
    # Vendor Routes
    path('vendor/products/create/', VendorProductCreateView.as_view(), name='vendor-product-create'),
]
