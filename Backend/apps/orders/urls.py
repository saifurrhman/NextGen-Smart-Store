from django.urls import path
from .views import OrderListView, OrderCreateView, RefundListView

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('refunds/', RefundListView.as_view(), name='refund-list'),
]
