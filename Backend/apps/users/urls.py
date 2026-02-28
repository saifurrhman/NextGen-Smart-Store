from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfileView, ChangePasswordView,
    SendInviteView, ListInvitationsView, AcceptInviteView, DeleteInvitationView,
    CustomerListView,
)
from .user_viewsets import UserViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('invitations/', ListInvitationsView.as_view(), name='list-invitations'),
    path('invitations/send/', SendInviteView.as_view(), name='send-invite'),
    path('invitations/accept/<str:token>/', AcceptInviteView.as_view(), name='accept-invite'),
    path('invitations/<str:pk>/', DeleteInvitationView.as_view(), name='delete-invitation'),
    path('customers/', CustomerListView.as_view(), name='customer-list'),
]
