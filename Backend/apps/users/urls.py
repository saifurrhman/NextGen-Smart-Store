from django.urls import path
from .views import (
    ProfileView, ChangePasswordView,
    SendInviteView, ListInvitationsView, AcceptInviteView, DeleteInvitationView,
)

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('invitations/', ListInvitationsView.as_view(), name='list-invitations'),
    path('invitations/send/', SendInviteView.as_view(), name='send-invite'),
    path('invitations/accept/<str:token>/', AcceptInviteView.as_view(), name='accept-invite'),
    path('invitations/<str:pk>/', DeleteInvitationView.as_view(), name='delete-invitation'),
]
