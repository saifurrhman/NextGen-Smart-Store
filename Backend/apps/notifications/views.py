"""
Notifications views — list notifications from MongoDB for the current user.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.tokens import AccessToken
from core.utils import get_mongo_db


def _get_user_email(request):
    auth = request.META.get('HTTP_AUTHORIZATION', '')
    if auth.startswith('Bearer '):
        try:
            token = AccessToken(auth.split(' ')[1])
            return token.get('user_id')
        except Exception:
            pass
    return None


class NotificationListView(APIView):
    """
    GET /api/v1/notifications/
    Lists notifications for the authenticated user (or all for admins).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            db = get_mongo_db()
            col = db['notifications_notification']
            user_email = _get_user_email(request)

            query = {}
            if user_email:
                query = {'$or': [{'user_email': user_email}, {'recipient': user_email}]}

            docs = list(col.find(query).sort('_id', -1).limit(50))
            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)
            return Response({'count': len(results), 'results': results})
        except Exception as e:
            return Response({'count': 0, 'results': [], 'error': str(e)})


class NotificationMarkReadView(APIView):
    """
    POST /api/v1/notifications/<id>/read/   — mark a notification as read.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk=None):
        try:
            from bson import ObjectId
            db = get_mongo_db()
            col = db['notifications_notification']
            col.update_one({'_id': ObjectId(pk)}, {'$set': {'is_read': True}})
            return Response({'message': 'Marked as read.'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
