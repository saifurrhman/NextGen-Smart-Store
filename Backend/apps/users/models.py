from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from djongo import models as djongo_models


class UserManager(BaseUserManager):
    """
    Custom manager for User model where email is the unique identifier.
    Replaces the default AbstractUser manager which assumes username as identifier.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'SUPER_ADMIN')
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model for NextGen Smart Store.
    """
    # Use MongoDB's native ObjectId as primary key
    # (fixes: int() argument must be... not 'ObjectId')
    id = djongo_models.ObjectIdField(primary_key=True)
    email = models.EmailField(unique=True)

    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    ROLE_CHOICES = (
        ('SUPER_ADMIN', 'Super Admin'),
        ('SUB_ADMIN', 'Sub Admin'),
        ('ADMIN', 'Admin'),
        ('VENDOR', 'Vendor'),
        ('CUSTOMER', 'Customer'),
        ('DELIVERY', 'Delivery'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')

    date_of_birth = models.DateField(null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)



    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # Use our custom manager
    objects = UserManager()

    def __str__(self):
        return self.email
