from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django.db.models import Count
from .models import TrafficLog
from .serializers import TrafficLogSerializer
from datetime import timedelta
from django.utils import timezone
import requests

@api_view(['POST'])
@permission_classes([AllowAny])
def track_visit(request):
    source = request.data.get('source', 'direct')
    
    # Simple IP extraction
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    # Optional: Prevent duplicate logging from same IP within a short timeframe (e.g., 24 hours) for the same source
    recent_visit = TrafficLog.objects.filter(
        ip_address=ip, 
        source=source, 
        created_at__gte=timezone.now() - timedelta(hours=24)
    ).exists()
    
    if not recent_visit:
        country = None
        state = None
        
        # Get Geolocation (Optional but helpful)
        if ip and ip != '127.0.0.1' and not ip.startswith('192.168.'):
            try:
                # Need a short timeout so we don't slow down the request
                geo_resp = requests.get(f'http://ip-api.com/json/{ip}', timeout=2)
                if geo_resp.status_code == 200:
                    geo_data = geo_resp.json()
                    if geo_data.get('status') == 'success':
                        country = geo_data.get('country')
                        state = geo_data.get('regionName')
            except Exception:
                pass
                
        TrafficLog.objects.create(source=source, ip_address=ip, country=country, state=state)
        return Response({"status": "logged", "new_visit": True}, status=status.HTTP_201_CREATED)
        
    return Response({"status": "logged", "new_visit": False}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny]) # Can be changed to IsAdminUser later
def traffic_stats(request):
    total_visits = TrafficLog.objects.count()
    
    stats = []
    country_counts = {}
    state_counts = {}
    
    if total_visits > 0:
        # Group source
        for source_code, _ in TrafficLog.SOURCE_CHOICES:
            count = TrafficLog.objects.filter(source=source_code).count()
            if count > 0:
                stats.append({'source': source_code, 'count': count})
        stats.sort(key=lambda x: x['count'], reverse=True)
        
        # Group by country
        for log in TrafficLog.objects.exclude(country__isnull=True).exclude(country=''):
            country_counts[log.country] = country_counts.get(log.country, 0) + 1
            
        # Group by state
        for log in TrafficLog.objects.exclude(state__isnull=True).exclude(state=''):
            state_counts[log.state] = state_counts.get(log.state, 0) + 1
            
    # Format for frontend
    formatted_stats = []
    
    # Color mapping for simple UI
    colors = {
        'google': '#4285F4',
        'meta': '#0668E1',
        'tiktok': '#000000',
        'direct': '#10B981'
    }
    
    for item in stats:
        source_name = item['source']
        formatted_stats.append({
            'name': dict(TrafficLog.SOURCE_CHOICES).get(source_name, source_name.title()),
            'value': item['count'],
            'color': colors.get(source_name, '#6B7280'),
            'percentage': round((item['count'] / total_visits) * 100) if total_visits > 0 else 0
        })
        
    country_stats = []
    for country, count in sorted(country_counts.items(), key=lambda item: item[1], reverse=True)[:5]:
        country_stats.append({
            'name': country,
            'value': count,
            'percentage': round((count / total_visits) * 100) if total_visits > 0 else 0
        })
        
    state_stats = []
    for state, count in sorted(state_counts.items(), key=lambda item: item[1], reverse=True)[:5]:
        state_stats.append({
            'name': state,
            'value': count,
            'percentage': round((count / total_visits) * 100) if total_visits > 0 else 0
        })
        
    return Response({
        "total_visits": total_visits,
        "sources": formatted_stats,
        "countries": country_stats,
        "states": state_stats
    })
