from django.db import models
from django.conf import settings
from apps.orders.models import Order
from djongo import models as djongo_models

class Transaction(models.Model):
    id = djongo_models.ObjectIdField(primary_key=True)
    STATUS_CHOICES = (
        ('success', 'Success'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, default='CREDIT_CARD')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Txn for Order {self.order.id} - {self.status}"

class Payout(models.Model):
    id = djongo_models.ObjectIdField(primary_key=True)
    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payouts')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    bank_info = models.TextField(help_text="Snapshot of bank details at time of request")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payout {self.amount} to {self.vendor.email} - {self.status}"
class FinancialReport(models.Model):
    REPORT_TYPES = (
        ('revenue', 'Revenue Report'),
        ('expense', 'Expense Report'),
        ('tax', 'Tax Report'),
        ('payout', 'Payout Report'),
        ('all', 'General Financial Statement'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('generated', 'Generated'),
        ('failed', 'Failed'),
    )
    
    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    start_date = models.DateField()
    end_date = models.DateField()
    
    # JSON field for the generated data snapshot
    data_snapshot = models.JSONField(null=True, blank=True)
    
    # Link to a generated file if applicable
    file_url = models.URLField(max_length=500, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.title} ({self.report_type})"
