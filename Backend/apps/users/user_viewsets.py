from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Q
from .serializers import UserSerializer
from core.pagination import MongoPagination

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users.
    GET /api/v1/users/           -> list all users (paginated)
    GET /api/v1/users/?role=CUSTOMER -> filter by role
    GET /api/v1/users/?search=xxx    -> search by name/email
    GET /api/v1/users/stats/         -> role-wise counts
    POST /api/v1/users/              -> create user
    DELETE /api/v1/users/<id>/       -> delete user
    """
    serializer_class = UserSerializer
    pagination_class = MongoPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = list(User.objects.all())
        # Sort by date_joined descending (Python side for Djongo compatibility)
        qs.sort(key=lambda u: u.date_joined, reverse=True)

        # Role filter
        role = self.request.query_params.get('role', '')
        if role:
            qs = [u for u in qs if u.role == role]

        # Search filter (name or email)
        search = self.request.query_params.get('search', '').strip().lower()
        if search:
            qs = [
                u for u in qs
                if search in (u.first_name or '').lower()
                or search in (u.last_name or '').lower()
                or search in (u.email or '').lower()
                or search in (u.username or '').lower()
            ]

        # Status filter
        is_active = self.request.query_params.get('is_active', '')
        if is_active == 'true':
            qs = [u for u in qs if u.is_active]
        elif is_active == 'false':
            qs = [u for u in qs if not u.is_active]

        return qs

    def create(self, request, *args, **kwargs):
        """Create a new user from admin panel."""
        data = request.data.copy()
        password = data.pop('password', None)
        email = data.get('email', '').lower().strip()
        if not email or not password:
            return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'detail': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.create_user(
                email=email,
                username=data.get('username', email),
                password=password,
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                role=data.get('role', 'CUSTOMER'),
                is_active=data.get('is_active', True),
            )
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Return role-wise user counts."""
        all_users = list(User.objects.all())
        total = len(all_users)
        customers = sum(1 for u in all_users if getattr(u, 'role', '') == 'CUSTOMER')
        vendors = sum(1 for u in all_users if getattr(u, 'role', '') == 'VENDOR')
        admins = sum(1 for u in all_users if getattr(u, 'role', '') in ('SUPER_ADMIN', 'SUB_ADMIN', 'ADMIN'))
        return Response({
            'total': total,
            'customers': customers,
            'vendors': vendors,
            'admins': admins,
        })

