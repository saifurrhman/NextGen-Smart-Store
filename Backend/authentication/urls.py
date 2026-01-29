from django.urls import path
from django.urls import path
from .views import LoginView, RegisterView, LogoutView, AdminUserCreateView, AdminRegisterView, VendorRegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name='auth-login'),
    path('register/', RegisterView.as_view(), name='auth-register'), # Customer Register
    path('admin/register/', AdminRegisterView.as_view(), name='admin-register-public'), # Public Admin Register
    path('vendor/register/', VendorRegisterView.as_view(), name='vendor-register-public'), # Public Vendor Register
    path('admin/create-user/', AdminUserCreateView.as_view(), name='admin-create-user'), # Admin only
    path('logout/', LogoutView.as_view(), name='auth-logout'),
]
