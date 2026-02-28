from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, KnowledgeBaseArticleViewSet, ChatSessionViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'kb', KnowledgeBaseArticleViewSet)
router.register(r'chat-sessions', ChatSessionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
