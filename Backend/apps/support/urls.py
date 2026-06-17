from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, KnowledgeBaseArticleViewSet, ChatSessionViewSet, ChatMessageViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'kb', KnowledgeBaseArticleViewSet)
router.register(r'knowledge-base', KnowledgeBaseArticleViewSet, basename='knowledge-base')
router.register(r'chat-sessions', ChatSessionViewSet, basename='chat-sessions')
router.register(r'chat-messages', ChatMessageViewSet, basename='chat-messages')


def debug_chat(request):
    """Debug endpoint: GET /api/v1/support/debug/"""
    try:
        from core.utils import get_mongo_db
        db = get_mongo_db()
        sessions_count = db['support_chatsession'].count_documents({})
        messages_count = db['support_chatmessage'].count_documents({})
        docs = list(db['support_chatsession'].find().limit(3))
        result = []
        for d in docs:
            result.append({
                '_id': str(d.get('_id')),
                'topic': d.get('topic'),
                'status': d.get('status'),
            })
        return JsonResponse({
            'sessions': sessions_count,
            'messages': messages_count,
            'sample_sessions': result,
            'status': 'OK'
        })
    except Exception as e:
        return JsonResponse({'error': str(e), 'status': 'ERROR'}, status=500)


urlpatterns = [
    path('debug/', debug_chat),
    path('', include(router.urls)),
]
