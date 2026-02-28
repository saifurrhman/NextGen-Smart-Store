import logging
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .serializers import UserSerializer, UserSerializer as CustomerSerializer
from .invitation_models import AdminInvitation

logger = logging.getLogger(__name__)
User = get_user_model()

FRONTEND_URL = 'http://localhost:5173'


def get_user_from_token(request):
    """
    Extract user from JWT token manually.
    djongo's boolean filter bug prevents JWTAuthentication from resolving request.user.
    """
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Bearer '):
        return None
    raw_token = auth_header.split(' ')[1]
    try:
        token = AccessToken(raw_token)
        user_email = token.get('user_id')
        if user_email:
            return User.objects.get(email=user_email)
    except Exception as e:
        logger.warning(f"get_user_from_token failed: {e}")
    return None


# ─────────────────────────────────────────────
# Profile endpoints
# ─────────────────────────────────────────────
class ProfileView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        allowed_fields = ['first_name', 'last_name', 'phone_number', 'address', 'username']
        for field in allowed_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        try:
            user.save()
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        current_password = request.data.get('current_password', '')
        new_password = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')
        if not all([current_password, new_password, confirm_password]):
            return Response({'error': 'All password fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(current_password):
            return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
        if new_password != confirm_password:
            return Response({'error': 'New passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────
# Admin Invitation endpoints
# ─────────────────────────────────────────────
class SendInviteView(APIView):
    """POST /api/v1/users/invitations/send/ — Super Admin sends invite email."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        sender = get_user_from_token(request)
        if not sender:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        email = request.data.get('email', '').strip().lower()
        department = request.data.get('department', '').strip()

        if not email or not department:
            return Response({'error': 'Email and department are required.'}, status=status.HTTP_400_BAD_REQUEST)

        valid_depts = [c[0] for c in AdminInvitation.DEPARTMENT_CHOICES]
        if department not in valid_depts:
            return Response({'error': f'Invalid department. Choose from: {", ".join(valid_depts)}'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already invited  
        existing = list(AdminInvitation.objects.filter(email=email, department=department))
        pending = [inv for inv in existing if inv.status == 'pending']
        if pending:
            return Response({'error': 'An invitation is already pending for this email and department.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create invitation
        invitation = AdminInvitation.create_invitation(
            email=email,
            department=department,
            invited_by=sender.email,
        )

        # Build invite link
        invite_link = f"{FRONTEND_URL}/admin/accept-invite/{invitation.invite_token}"
        dept_label = dict(AdminInvitation.DEPARTMENT_CHOICES).get(department, department)

        # Send email
        subject = f"You're invited to join NextGenStore — {dept_label} Department"
        message = (
            f"Hello,\n\n"
            f"You have been invited by {sender.email} to join the {dept_label} department "
            f"as a Sub Admin at NextGenStore.\n\n"
            f"Click the link below to set your password and accept the invitation:\n\n"
            f"{invite_link}\n\n"
            f"This invitation will expire in 7 days.\n\n"
            f"— NextGen Smart Store Team"
        )

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"SendInvite: email failed: {e}")
            # Still save the invitation even if email fails
            return Response({
                'message': 'Invitation created but email sending failed. Share the link manually.',
                'invite_link': invite_link,
                'invitation_id': str(invitation.pk),
            }, status=status.HTTP_201_CREATED)

        return Response({
            'message': f'Invitation sent to {email} for {dept_label} department.',
            'invitation_id': str(invitation.pk),
        }, status=status.HTTP_201_CREATED)


class ListInvitationsView(APIView):
    """GET /api/v1/users/invitations/ — List all invitations."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        sender = get_user_from_token(request)
        if not sender:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        all_invites = list(AdminInvitation.objects.all())
        # Sort by invited_at descending (Python-side for djongo compatibility)
        all_invites.sort(key=lambda x: x.invited_at, reverse=True)

        result = []
        for inv in all_invites:
            result.append({
                'id': str(inv.pk),
                'email': inv.email,
                'department': inv.department,
                'department_label': dict(AdminInvitation.DEPARTMENT_CHOICES).get(inv.department, inv.department),
                'status': inv.status,
                'invited_by': inv.invited_by,
                'invited_at': inv.invited_at.isoformat() if inv.invited_at else None,
                'accepted_at': inv.accepted_at.isoformat() if inv.accepted_at else None,
                'admin_name': inv.admin_name,
            })
        return Response(result, status=status.HTTP_200_OK)


class AcceptInviteView(APIView):
    """POST /api/v1/users/invitations/accept/ — Sub-admin sets password and accepts."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        """Verify token and return invitation details."""
        try:
            invites = list(AdminInvitation.objects.filter(invite_token=token))
            if not invites:
                return Response({'error': 'Invalid invitation link.'}, status=status.HTTP_404_NOT_FOUND)
            inv = invites[0]
            if inv.status == 'accepted':
                return Response({'error': 'This invitation has already been accepted.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                'email': inv.email,
                'department': inv.department,
                'department_label': dict(AdminInvitation.DEPARTMENT_CHOICES).get(inv.department, inv.department),
                'invited_by': inv.invited_by,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, token):
        """Accept invite: create user account or update existing, set password."""
        try:
            invites = list(AdminInvitation.objects.filter(invite_token=token))
            if not invites:
                return Response({'error': 'Invalid invitation link.'}, status=status.HTTP_404_NOT_FOUND)
            inv = invites[0]
            if inv.status == 'accepted':
                return Response({'error': 'This invitation has already been accepted.'}, status=status.HTTP_400_BAD_REQUEST)

            password = request.data.get('password', '')
            confirm_password = request.data.get('confirm_password', '')
            name = request.data.get('name', '').strip()

            if not password or not confirm_password:
                return Response({'error': 'Password and confirmation are required.'}, status=status.HTTP_400_BAD_REQUEST)
            if password != confirm_password:
                return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
            if len(password) < 8:
                return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if user already exists
            user = None
            try:
                user = User.objects.get(email=inv.email)
                # Update existing user
                user.set_password(password)
                user.role = 'SUB_ADMIN'
                if name:
                    parts = name.split(' ', 1)
                    user.first_name = parts[0]
                    user.last_name = parts[1] if len(parts) > 1 else ''
                user.save()
            except User.DoesNotExist:
                # Create new user
                parts = name.split(' ', 1) if name else ['', '']
                user = User.objects.create_user(
                    email=inv.email,
                    password=password,
                    username=inv.email.split('@')[0],
                    first_name=parts[0] if parts else '',
                    last_name=parts[1] if len(parts) > 1 else '',
                    role='SUB_ADMIN',
                    is_active=True,
                )

            # Mark invitation as accepted
            inv.status = 'accepted'
            inv.accepted_at = timezone.now()
            inv.admin_name = name or user.email
            inv.save()

            # Generate JWT tokens for the new admin
            refresh = RefreshToken()
            refresh['user_id'] = str(user.email)
            user_data = UserSerializer(user).data

            return Response({
                'message': 'Invitation accepted successfully! You can now login.',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'role': user.role,
                'user': user_data,
                'department': inv.department,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"AcceptInvite error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteInvitationView(APIView):
    """DELETE /api/v1/users/invitations/<id>/ — Remove an invitation."""
    permission_classes = [permissions.AllowAny]

    def delete(self, request, pk):
        sender = get_user_from_token(request)
        if not sender:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            invites = list(AdminInvitation.objects.all())
            target = None
            for inv in invites:
                if str(inv.pk) == pk:
                    target = inv
                    break
            if not target:
                return Response({'error': 'Invitation not found.'}, status=status.HTTP_404_NOT_FOUND)
            target.delete()
            return Response({'message': 'Invitation deleted.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CustomerListView(generics.ListAPIView):
    queryset = User.objects.filter(role='CUSTOMER').order_by('-date_joined')
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]
