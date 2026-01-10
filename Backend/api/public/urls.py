from django.urls import path
from .views import (
    ProductPublicListView, ProductDetailView, CategoryListView,
    OrderCreateView, OrderListView, OrderDetailView
)

urlpatterns = [
    # Store-front
    path('products/', ProductPublicListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    
    # Orders (User side)
    path('orders/', OrderCreateView.as_view(), name='order-create'),
    path('orders/history/', OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]
