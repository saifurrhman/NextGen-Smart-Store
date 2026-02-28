from rest_framework import serializers
from .models import Ticket, KnowledgeBaseArticle, ChatSession
from apps.users.serializers import UserSerializer

class TicketSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'

class KnowledgeBaseArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeBaseArticle
        fields = '__all__'

class ChatSessionSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    agent_details = UserSerializer(source='agent', read_only=True)

    class Meta:
        model = ChatSession
        fields = '__all__'
