from django.db import models
from djongo import models as djongo_models
from django.utils import timezone
import uuid


class AdminInvitation(models.Model):
    """Tracks department admin invitations sent by Super Admin."""
    id = djongo_models.ObjectIdField(primary_key=True)

    DEPARTMENT_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('content', 'Content'),
        ('finance', 'Finance'),
        ('marketing', 'Marketing'),
        ('operations', 'Operations'),
        ('support', 'Support'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('expired', 'Expired'),
    ]

    email = models.EmailField()
    department = models.CharField(max_length=30, choices=DEPARTMENT_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    invite_token = models.CharField(max_length=64, unique=True)
    invited_by = models.EmailField()  # super admin email
    invited_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    admin_name = models.CharField(max_length=100, blank=True)  # filled on accept

    class Meta:
        ordering = ['-invited_at']

    @classmethod
    def create_invitation(cls, email, department, invited_by):
        token = uuid.uuid4().hex
        return cls.objects.create(
            email=email,
            department=department,
            invite_token=token,
            invited_by=invited_by,
        )

    def __str__(self):
        return f"{self.email} → {self.department} ({self.status})"
