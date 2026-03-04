from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, RefundListView, OrderReportViewSet

router = DefaultRouter()
router.register(r'reports', OrderReportViewSet)
router.register(r'', OrderViewSet, basename='orders')

urlpatterns = [
    path('refunds/', RefundListView.as_view(), name='refund-list'),
    path('', include(router.urls)),
]
