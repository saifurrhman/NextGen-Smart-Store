from django.urls import path
from .views import VendorRegistrationView

urlpatterns = [
    path('register/', VendorRegistrationView.as_view(), name='vendor-register'),
]
