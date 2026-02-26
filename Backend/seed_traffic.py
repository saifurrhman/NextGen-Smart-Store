from textwrap import dedent
import os
import sys
import django
import random
from datetime import timedelta
from django.utils import timezone

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from apps.analytics.models import TrafficLog

def seed_traffic():
    print("Clearing existing traffic logs...")
    TrafficLog.objects.all().delete()
    
    print("Seeding new traffic logs...")
    sources = [
        ('google', 90),      # ~45%
        ('meta', 50),        # ~25%
        ('direct', 40),      # ~20%
        ('tiktok', 20)        # ~10%
    ]
    
    total_logs = sum(count for _, count in sources)
    now = timezone.now()
    
    for source, count in sources:
        for _ in range(count):
            random_hours = random.randint(0, 24 * 7)
            random_minutes = random.randint(0, 60)
            created_at = now - timedelta(hours=random_hours, minutes=random_minutes)
            
            TrafficLog.objects.create(
                source=source,
                ip_address=f"192.168.1.{random.randint(1, 255)}",
                created_at=created_at
            )
            
    print(f"Successfully created {total_logs} traffic logs!")

if __name__ == '__main__':
    seed_traffic()
