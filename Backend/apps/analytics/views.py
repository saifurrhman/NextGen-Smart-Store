from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django.db.models import Count
from .models import TrafficLog
from .serializers import TrafficLogSerializer
from datetime import timedelta
from django.utils import timezone

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
        TrafficLog.objects.create(source=source, ip_address=ip)
        return Response({"status": "logged", "new_visit": True}, status=status.HTTP_201_CREATED)
        
    return Response({"status": "logged", "new_visit": False}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny]) # Can be changed to IsAdminUser later
def traffic_stats(request):
    # Group by source
    stats = TrafficLog.objects.values('source').annotate(count=Count('id')).order_by('-count')
    
    # Format for frontend
    formatted_stats = []
    total_visits = sum(item['count'] for item in stats)
    
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
        
    return Response({
        "total_visits": total_visits,
        "sources": formatted_stats
    })
