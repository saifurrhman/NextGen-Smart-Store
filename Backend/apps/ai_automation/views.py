from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AIActivityLog, AISystemStatus
from .serializers import AIActivityLogSerializer, AISystemStatusSerializer
import random

class AIActivityLogViewSet(viewsets.ModelViewSet):
    queryset = AIActivityLog.objects.all()
    serializer_class = AIActivityLogSerializer

class AISystemStatusViewSet(viewsets.ModelViewSet):
    queryset = AISystemStatus.objects.all()
    serializer_class = AISystemStatusSerializer

class AIDashboardStatsViewSet(viewsets.ViewSet):
    def list(self, request):
        # In a real app, these would be aggregated from other models
        # For now, we return representative data
        return Response({
            'chatsHandled': 0,
            'chatsGrowth': 0.0,
            'adConversions': 0,
            'adGrowth': 0.0,
            'triggers': 0
        })
