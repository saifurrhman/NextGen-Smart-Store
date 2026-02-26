from django.db import models
from django.utils import timezone

class TrafficLog(models.Model):
    SOURCE_CHOICES = [
        ('google', 'Google'),
        ('meta', 'Meta (Facebook/Instagram)'),
        ('tiktok', 'TikTok'),
        ('direct', 'Direct/Other'),
    ]
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default='direct')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'analytics_traffic_log'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.source} visit at {self.created_at}"
