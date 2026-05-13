import os
import django
import sys
from datetime import timedelta

sys.path.append(r"d:\Semester\New folder\NextGen-Smart-Store\Backend")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings')
django.setup()

from django.utils import timezone
from apps.analytics.models import TrafficLog

def seed_traffic_data():
    print("Clearing existing traffic logs...")
    TrafficLog.objects.all().delete()

    print("Generating traffic data to match the dashboard design...")
    
    # Target counts from user's image
    # Sources: 119 total
    sources = (['google'] * 44) + (['meta'] * 29) + (['direct'] * 29) + (['tiktok'] * 17)
    
    # Countries: 25 US, 16 PK, 16 IN, 14 UK, 9 AU
    locations = (['United States'] * 25) + (['Pakistan'] * 16) + (['India'] * 16) + (['United Kingdom'] * 14) + (['Australia'] * 9)
    
    # Fill remaining locations with None so we hit exactly 119 visits
    locations.extend([None] * (len(sources) - len(locations)))
    
    now = timezone.now()
    logs_to_create = []
    
    for i in range(len(sources)):
        # Generate some dummy states if country exists
        state = None
        if locations[i] == 'United States': state = 'New York'
        elif locations[i] == 'Pakistan': state = 'Punjab'
        elif locations[i] == 'India': state = 'Maharashtra'
        elif locations[i] == 'United Kingdom': state = 'England'
        elif locations[i] == 'Australia': state = 'New South Wales'
            
        logs_to_create.append(TrafficLog(
            source=sources[i],
            country=locations[i],
            state=state,
            created_at=now - timedelta(minutes=i*15) # Spread out over time
        ))
        
    TrafficLog.objects.bulk_create(logs_to_create)
    print(f"Successfully seeded {TrafficLog.objects.count()} traffic logs.")

if __name__ == '__main__':
    seed_traffic_data()
