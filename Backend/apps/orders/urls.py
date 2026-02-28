from django.urls import path
from .views import OrderListView, RefundListView

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('refunds/', RefundListView.as_view(), name='refund-list'),
]
