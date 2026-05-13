import uuid
from django.db import models
from django.conf import settings
from djongo import models as djongo_models

class Notification(models.Model):
    id = djongo_models.ObjectIdField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        help_text="The user this notification belongs to."
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    
    # Optional fields for deeper integration
    link = models.CharField(max_length=255, blank=True, null=True, help_text="Optional frontend path to redirect to when clicked.")
    type = models.CharField(max_length=50, default='system', help_text="Type of notification: order, system, refund, etc.")
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.email}"
