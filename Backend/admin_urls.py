from django.urls import path
from vendors.admin_views import AdminDashboardStatsView, AdminVendorApprovalView
# Import other admin views here (e.g., User Management)

urlpatterns = [
    # Stats
    path('stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    
    # Vendor Management
    path('vendors/approve/<int:pk>/', AdminVendorApprovalView.as_view(), name='admin-approve-vendor'),
    
    # Placeholder for User Management
    # path('users/', UserListView.as_view(), name='admin-users'),
]
