from rest_framework import serializers
from .models import AIActivityLog, AISystemStatus

class AIActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIActivityLog
        fields = '__all__'

class AISystemStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISystemStatus
        fields = '__all__'
