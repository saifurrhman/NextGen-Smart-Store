from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from core.utils import get_mongo_db

User = get_user_model()

class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        if user:
            # Fix Djongo primary key mapping bug where request.user.id/pk is None
            if getattr(user, 'id', None) is None or str(user.id) == 'None' or getattr(user, 'pk', None) is None:
                user_id = getattr(user, '_id', None)
                if not user_id:
                    try:
                        db = get_mongo_db()
                        doc = db['users_user'].find_one({'email': user.email})
                        if doc:
                            user_id = doc.get('_id')
                    except Exception:
                        pass
                
                if user_id:
                    user.id = user_id
                    user.pk = user_id
        return user
