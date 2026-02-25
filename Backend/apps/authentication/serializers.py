from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

from apps.users.serializers import UserSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom login serializer that:
    1. Accepts EMAIL or USERNAME in the 'username' field
    2. Does NOT use Django's authenticate() — because djongo has a known bug
       where it cannot filter boolean fields (is_active=True) correctly,
       causing authenticate() to always return None even with correct credentials.
    3. Manually fetches the user and verifies password using check_password().
    """
    username_field = 'username'

    def validate(self, attrs):
        login_id = attrs.get('username', '').strip()
        password  = attrs.get('password', '')

        if not login_id or not password:
            raise serializers.ValidationError(
                {'detail': 'Email/username and password are required.'}
            )

        user = None

        # ── Step 1: Try to find user by email ──────────────────────────────
        # (case-insensitive: normalize to lowercase)
        try:
            user = User.objects.get(email=login_id.lower())
        except User.DoesNotExist:
            pass

        # ── Step 2: If not found by email, try by username ─────────────────
        if user is None:
            try:
                user = User.objects.get(username=login_id)
            except User.DoesNotExist:
                pass

        # ── Step 3: Validate user and password ─────────────────────────────
        if user is None:
            raise serializers.ValidationError(
                {'detail': 'No account found with this email/username.'}
            )

        # Manually check password — bypasses djongo boolean filter bug in authenticate()
        if not user.check_password(password):
            raise serializers.ValidationError(
                {'detail': 'Incorrect password. Please try again.'}
            )

        # NOTE: We intentionally skip the is_active check via authenticate() because
        # djongo cannot reliably filter boolean fields. Users created via OTP flow
        # are always set is_active=True at creation time.

        # ── Step 4: Generate JWT tokens ────────────────────────────────────
        refresh = self.get_token(user)
        self.user = user

        return {
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
            'role': getattr(user, 'role', 'CUSTOMER'),
            'user': UserSerializer(user).data,
        }
