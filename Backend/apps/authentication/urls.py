from django.urls import path
from .views import (
    LoginView,
    RegisterView,
    SendOTPView,
    VerifyOTPView,
    RegisterWithOTPView,
    ResetPasswordView,
    DebugUsersView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Auth
    path('login/', LoginView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),

    # OTP
    path('otp/send/', SendOTPView.as_view(), name='otp_send'),
    path('otp/verify/', VerifyOTPView.as_view(), name='otp_verify'),
    path('register-otp/', RegisterWithOTPView.as_view(), name='register_with_otp'),
    path('password/reset/confirm/', ResetPasswordView.as_view(), name='password_reset_confirm'),
    # TEMP DEBUG
    path('debug-users/', DebugUsersView.as_view(), name='debug_users'),
]

