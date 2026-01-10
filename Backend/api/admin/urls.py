from django.urls import path
from .views import AdminDashboardStatsView, AdminVendorApprovalView

urlpatterns = [
    path('stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('vendors/approve/<int:pk>/', AdminVendorApprovalView.as_view(), name='admin-approve-vendor'),
]
