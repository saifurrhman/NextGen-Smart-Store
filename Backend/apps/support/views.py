from rest_framework import viewsets
from .models import Ticket, KnowledgeBaseArticle, ChatSession
from .serializers import TicketSerializer, KnowledgeBaseArticleSerializer, ChatSessionSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    filterset_fields = ['status', 'priority']
    search_fields = ['subject', 'user__email']

class KnowledgeBaseArticleViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeBaseArticle.objects.all().order_by('-created_at')
    serializer_class = KnowledgeBaseArticleSerializer
    filterset_fields = ['category']
    search_fields = ['title', 'content']

class ChatSessionViewSet(viewsets.ModelViewSet):
    queryset = ChatSession.objects.all().order_by('-created_at')
    serializer_class = ChatSessionSerializer
    filterset_fields = ['status']
    search_fields = ['customer_name', 'topic', 'user__email', 'agent__email']
