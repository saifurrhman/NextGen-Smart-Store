from django.db import models
from django.utils.text import slugify
from djongo import models as djongo_models

class Attribute(models.Model):
    id = djongo_models.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    terms = models.TextField(help_text="Comma-separated values, e.g. Red, Blue, Green")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
