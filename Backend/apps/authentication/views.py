import random
import string
import logging
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from .models import OTPCode
from apps.users.serializers import UserSerializer

logger = logging.getLogger(__name__)

User = get_user_model()


# ─────────────────────────────────────────────
# TEMPORARY DEBUG — remove after fix confirmed
# GET /api/v1/auth/debug-users/
# ─────────────────────────────────────────────
class DebugUsersView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            all_users = list(User.objects.all())
            result = []
            for u in all_users:
                result.append({
                    'email': u.email,
                    'username': u.username,
                    'role': getattr(u, 'role', '?'),
                    'is_active': u.is_active,
                    'has_password': bool(u.password),
                    'password_prefix': u.password[:20] if u.password else None,
                })
            return Response({'count': len(result), 'users': result})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def post(self, request):
        """Test manual password check for a specific email+password."""
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        try:
            user = User.objects.get(email=email)
            pw_ok = user.check_password(password)
            return Response({
                'found': True,
                'email': user.email,
                'is_active': user.is_active,
                'role': getattr(user, 'role', '?'),
                'password_check': pw_ok,
                'password_prefix': user.password[:30] if user.password else None,
            })
        except User.DoesNotExist:
            return Response({'found': False, 'error': 'User not found by email'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)


# ─────────────────────────────────────────────
# LOGIN — completely bypasses simplejwt's 
# TokenObtainPairView to avoid djongo bugs
# ─────────────────────────────────────────────
class LoginView(APIView):
    """
    Plain login endpoint.
    Accepts: { "username": "<email>", "password": "<password>" }
    Returns: { "access": "...", "refresh": "...", "role": "...", "user": {...} }
    
    Why not TokenObtainPairView?
      - simplejwt calls Django's authenticate() internally
      - authenticate() filters is_active=True via the ORM
      - djongo cannot reliably filter boolean fields
      - So authenticate() ALWAYS returns None → "Invalid credentials"
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        login_id = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        logger.info(f"LoginView: attempt with login_id={login_id}")

        if not login_id or not password:
            return Response(
                {'detail': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── Find user by email (primary) or username (fallback) ──
        user = None
        try:
            user = User.objects.get(email=login_id.lower())
            logger.info(f"LoginView: found user by email: {user.email}")
        except User.DoesNotExist:
            pass

        if user is None:
            try:
                user = User.objects.get(username=login_id)
                logger.info(f"LoginView: found user by username: {user.username}")
            except User.DoesNotExist:
                pass

        if user is None:
            logger.warning(f"LoginView: no user found for {login_id}")
            return Response(
                {'detail': 'No account found with this email.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ── Check password ──────────────────────────────────────
        logger.info(f"LoginView: checking password, hash prefix = {user.password[:30] if user.password else 'EMPTY'}")
        if not user.check_password(password):
            logger.warning(f"LoginView: password mismatch for {user.email}")
            return Response(
                {'detail': 'Incorrect password. Please try again.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ── Generate JWT tokens ─────────────────────────────────
        # NOTE: Cannot use RefreshToken.for_user(user) because:
        #   - User.pk is an ObjectId (djongo ObjectIdField)
        #   - simplejwt's token_blacklist tries to save OutstandingToken
        #     with a ForeignKey to the user
        #   - Django sees ObjectId pk as "unsaved" → ValueError
        # So we build the token manually:
        refresh = RefreshToken()
        refresh['user_id'] = str(user.email)  # Use email — ObjectId pk returns None with djongo
        user_data = UserSerializer(user).data

        logger.info(f"LoginView: login SUCCESS for {user.email} role={user.role}")

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': getattr(user, 'role', 'CUSTOMER'),
            'user': user_data,
        }, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────
# 1. Send OTP — used by Register & Forgot Password
# ─────────────────────────────────────────────
class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        purpose = request.data.get('purpose', '')

        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if purpose not in [OTPCode.PURPOSE_REGISTER, OTPCode.PURPOSE_PASSWORD_RESET]:
            return Response({'error': 'Invalid purpose.'}, status=status.HTTP_400_BAD_REQUEST)

        # For password_reset: check email exists
        if purpose == OTPCode.PURPOSE_PASSWORD_RESET:
            if not User.objects.filter(email=email).exists():
                return Response({'error': 'No account found with this email.'}, status=status.HTTP_404_NOT_FOUND)

        # For register: check email not already taken
        if purpose == OTPCode.PURPOSE_REGISTER:
            if User.objects.filter(email=email).exists():
                return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create OTP
        otp = OTPCode.create_for_email(email, purpose)
        logger.info(f"SendOTP: created OTP id={otp.pk} code={otp.code} for {email} purpose={purpose}")

        # Send email
        subject_map = {
            OTPCode.PURPOSE_REGISTER: 'Verify your NextGen Smart Store account',
            OTPCode.PURPOSE_PASSWORD_RESET: 'Reset your NextGen Smart Store password',
        }
        message = (
            f"Your verification code is: {otp.code}\n\n"
            f"This code expires in 10 minutes.\n\n"
            f"If you did not request this, please ignore this email.\n\n"
            f"— NextGen Smart Store Team"
        )

        try:
            send_mail(
                subject=subject_map[purpose],
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'OTP sent successfully.', 'email': email}, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────
# 2. Verify OTP — confirm the code is correct
# ─────────────────────────────────────────────
class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        code = request.data.get('code', '').strip()
        purpose = request.data.get('purpose', '')

        if not all([email, code, purpose]):
            return Response({'error': 'email, code, and purpose are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # NOTE: djongo has known bugs with:
        #  1. ORDER BY  → use Python sort instead of .latest()
        #  2. Boolean field filters (is_used=False) → filter in Python
        # So we fetch by email+code+purpose only, then filter is_used in Python.
        all_otps = list(OTPCode.objects.filter(email=email, code=code, purpose=purpose))
        logger.info(f"VerifyOTP: total OTPs found for {email}: {len(all_otps)}")
        for o in all_otps:
            logger.info(f"  -> id={o.pk} is_used={o.is_used} created={o.created_at} valid={o.is_valid()}")

        # Filter unused in Python
        candidates = [o for o in all_otps if not o.is_used]
        if not candidates:
            logger.warning(f"VerifyOTP: no unused OTP for email={email} code={code} purpose={purpose}")
            return Response({'error': 'Invalid or expired code. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)

        otp = sorted(candidates, key=lambda x: x.created_at, reverse=True)[0]

        if not otp.is_valid():
            logger.warning(f"VerifyOTP: OTP expired for {email}")
            return Response({'error': 'This code has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark used for password_reset (register account creation marks it later)
        if purpose == OTPCode.PURPOSE_PASSWORD_RESET:
            otp.is_used = True
            otp.save()

        return Response({'message': 'OTP verified.', 'verified': True}, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────
# 3. Register with verified OTP
# ─────────────────────────────────────────────
class RegisterWithOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        code = request.data.get('code', '').strip()

        # Re-verify OTP before creating account
        # NOTE: djongo boolean filter bug — fetch by email+code+purpose, filter is_used in Python
        all_otps = list(OTPCode.objects.filter(email=email, code=code, purpose=OTPCode.PURPOSE_REGISTER))
        logger.info(f"RegisterWithOTP: total OTPs found for {email}: {len(all_otps)}")

        candidates = [o for o in all_otps if not o.is_used]
        if not candidates:
            logger.warning(f"RegisterWithOTP: no unused OTP for email={email}")
            return Response({'error': 'Invalid or expired verification code.'}, status=status.HTTP_400_BAD_REQUEST)

        otp = sorted(candidates, key=lambda x: x.created_at, reverse=True)[0]

        if not otp.is_valid():
            return Response({'error': 'Code expired. Please register again.'}, status=status.HTTP_400_BAD_REQUEST)

        ALLOWED_ROLES = ['CUSTOMER', 'VENDOR', 'SUB_ADMIN', 'DELIVERY']
        role = request.data.get('role', 'CUSTOMER').upper()
        if role not in ALLOWED_ROLES:
            role = 'CUSTOMER'

        try:
            raw_password = request.data.get('password')
            user = User.objects.create_user(
                email=email,
                password=raw_password,
                username=request.data.get('username'),
                first_name=request.data.get('first_name', ''),
                last_name=request.data.get('last_name', ''),
                phone_number=request.data.get('phone', ''),
                address=request.data.get('address', ''),
                role=role,
                is_active=True,
            )
            logger.info(f"RegisterWithOTP: user created email={user.email} role={user.role}")
            logger.info(f"RegisterWithOTP: password hash = {user.password[:40] if user.password else 'EMPTY!'}")
            logger.info(f"RegisterWithOTP: check_password = {user.check_password(raw_password)}")

            otp.is_used = True
            otp.save()
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"RegisterWithOTP: create_user failed: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ─────────────────────────────────────────────
# 4. Reset Password after OTP verified
# ─────────────────────────────────────────────
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        new_password = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')

        if not all([email, new_password, confirm_password]):
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successfully.'}, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────
# Legacy: Original RegisterView (kept for compatibility)
# ─────────────────────────────────────────────
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        ALLOWED_ROLES = ['CUSTOMER', 'VENDOR', 'SUB_ADMIN', 'DELIVERY']
        role = request.data.get('role', 'CUSTOMER').upper()
        if role not in ALLOWED_ROLES:
            role = 'CUSTOMER'
        try:
            user = User.objects.create_user(
                email=request.data.get('email', '').strip().lower(),
                password=request.data.get('password'),
                username=request.data.get('username'),
                first_name=request.data.get('first_name', ''),
                last_name=request.data.get('last_name', ''),
                phone_number=request.data.get('phone', ''),
                address=request.data.get('address', ''),
                role=role,
            )
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
