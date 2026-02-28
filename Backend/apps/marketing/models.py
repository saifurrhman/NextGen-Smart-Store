from django.db import models

class Campaign(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('scheduled', 'Scheduled'),
        ('draft', 'Draft'),
    ]
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    spent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Promotion(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)  # Conditional, BOGO, etc.
    discount = models.CharField(max_length=100) # 100% Shipping, 50% Item
    status = models.CharField(max_length=50)
    usage_limit = models.CharField(max_length=50, default='Unlimited')
    redeemed = models.IntegerField(default=0)
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
    campaign_name = models.CharField(max_length=255)
    platform = models.CharField(max_length=100) # Meta Ads, Google Ads
    spend = models.DecimalField(max_digits=10, decimal_places=2)
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    roas = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.campaign_name} on {self.platform}"
