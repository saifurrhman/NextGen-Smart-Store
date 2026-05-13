from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'user_id', 'title', 'message', 'is_read', 'link', 'type', 'created_at']
