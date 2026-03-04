from django.db import models

class Campaign(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('scheduled', 'Scheduled'),
        ('draft', 'Draft'),
        ('ended', 'Ended'),
    ]
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    spent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Promotion(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('upcoming', 'Upcoming'),
    ]
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)  # percentage, fixed, shipping
    discount = models.CharField(max_length=100)  # e.g. 20%, PKR 500
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')
    usage_limit = models.IntegerField(default=100)
    redeemed = models.IntegerField(default=0)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Coupon(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
    ]
    code = models.CharField(max_length=50, unique=True)
    discount = models.CharField(max_length=100)
    min_purchase = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valid_from = models.DateField()
    valid_until = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code

class Ad(models.Model):
    PLATFORM_CHOICES = [
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('google', 'Google'),
        ('tiktok', 'TikTok'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('ended', 'Ended'),
    ]
    campaign_name = models.CharField(max_length=255)
    platform = models.CharField(max_length=100, choices=PLATFORM_CHOICES, default='facebook')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    spend = models.DecimalField(max_digits=10, decimal_places=2)
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    roas = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.campaign_name} on {self.platform}"
