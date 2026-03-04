from django.db import models
from django.conf import settings
from apps.orders.models import Order

class Delivery(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('canceled', 'Canceled'),
    ]
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='deliveries')
    delivery_boy = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'DELIVERY'})
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    tracking_id = models.CharField(max_length=100, unique=True)
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    actual_delivery = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Delivery {self.tracking_id} for Order {self.order.id}"

class DailyStatsLog(models.Model):
    """Manual daily operation log entries."""
    date = models.DateField()
    total_orders = models.IntegerField(default=0)
    packed = models.IntegerField(default=0)
    shipped = models.IntegerField(default=0)
    exceptions = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"DailyStats {self.date}"
