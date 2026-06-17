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
            user = User.objects.get(email=user_email)
            if user:
                # Fix Djongo primary key mapping bug where user.id/pk is None
                if getattr(user, 'id', None) is None or str(user.id) == 'None' or getattr(user, 'pk', None) is None:
                    _id_val = getattr(user, '_id', None)
                    if not _id_val:
                        from core.utils import get_mongo_db
                        try:
                            db = get_mongo_db()
                            doc = db['users_user'].find_one({'email': user_email})
                            if doc:
                                _id_val = doc.get('_id')
                        except Exception:
                            pass
                    if _id_val:
                        user.id = _id_val
                        user.pk = _id_val
            return user
    except Exception as e:
        logger.warning(f"get_user_from_token failed: {e}")
    return None
