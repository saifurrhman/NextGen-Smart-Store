import logging
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()

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
