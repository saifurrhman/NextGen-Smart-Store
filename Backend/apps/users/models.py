from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom User model for NextGen Smart Store.
    """
    email = models.EmailField(unique=True)
    
    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email
