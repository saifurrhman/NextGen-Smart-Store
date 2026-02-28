from django.db import models
from django.utils import timezone

class AIActivityLog(models.Model):
    TYPE_CHOICES = [
        ('support', 'Support'),
        ('marketing', 'Marketing'),
        ('operations', 'Operations'),
    ]
    action = models.CharField(max_length=255)
    details = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    activity_type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.activity_type}: {self.action}"

class AISystemStatus(models.Model):
    STATUS_CHOICES = [
        ('healthy', 'Healthy'),
        ('warning', 'Warning'),
        ('down', 'Down'),
    ]
    agent_name = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='healthy')
    last_checked = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.agent_name}: {self.status}"
