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

def seed_location_traffic():
    print("Seeding location traffic logs...")
    locations = [
        ('United States', 'California'),
        ('United States', 'New York'),
        ('United Kingdom', 'England'),
        ('Pakistan', 'Punjab'),
        ('India', 'Delhi'),
        ('Australia', 'New South Wales')
    ]
    
    sources = ['google', 'meta', 'direct', 'tiktok']
    now = timezone.now()
    total_created = 0
    
    for _ in range(80):
        country, state = random.choice(locations)
        source = random.choice(sources)
        ip = f"{random.randint(1, 200)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"
        
        random_hours = random.randint(0, 24 * 7)
        created_at = now - timedelta(hours=random_hours)
        
        TrafficLog.objects.create(
            source=source,
            ip_address=ip,
            country=country,
            state=state,
            created_at=created_at
        )
        total_created += 1
            
    print(f"Successfully created {total_created} location logs!")

if __name__ == '__main__':
    seed_location_traffic()
