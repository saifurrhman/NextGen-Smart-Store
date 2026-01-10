from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('SUPER_ADMIN', 'Super Admin'),
        ('SUB_ADMIN', 'Sub-Admin'),
        ('FINANCE_MANAGER', 'Finance Manager'),
        ('MARKETING_MANAGER', 'Marketing Manager'),
        ('DATA_ANALYST', 'Data Analyst'),
        ('VENDOR', 'Vendor'),
        ('DELIVERY_TEAM', 'Delivery Team'),
        ('CUSTOMER', 'Customer'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    # Required for Django Admin to display role
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
