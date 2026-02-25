from django.db import models
from djongo import models as djongo_models
from django.contrib.auth import get_user_model
import random
import string
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class OTPCode(models.Model):
    # MongoDB ObjectId as primary key (fixes: int() not 'ObjectId' error)
    id = djongo_models.ObjectIdField(primary_key=True)
    PURPOSE_REGISTER = 'register'
    PURPOSE_PASSWORD_RESET = 'password_reset'
    PURPOSE_CHOICES = [
        (PURPOSE_REGISTER, 'Registration'),
        (PURPOSE_PASSWORD_RESET, 'Password Reset'),
    ]

    email = models.EmailField()
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def is_valid(self):
        """Returns True if code is not used and not older than 10 minutes."""
        expiry = self.created_at + timedelta(minutes=10)
        return not self.is_used and timezone.now() < expiry

    @classmethod
    def generate_code(cls):
        return ''.join(random.choices(string.digits, k=6))

    @classmethod
    def create_for_email(cls, email, purpose):
        """Invalidate old codes and create a fresh one.
        NOTE: We iterate + save individually instead of .update()
        because djongo cannot parse 'NOT boolean_field' in bulk UPDATE SQL.
        """
        for old_otp in cls.objects.filter(email=email, purpose=purpose):
            if not old_otp.is_used:
                old_otp.is_used = True
                old_otp.save()
        code = cls.generate_code()
        return cls.objects.create(email=email, code=code, purpose=purpose)

    def __str__(self):
        return f"{self.email} - {self.purpose} - {self.code}"
