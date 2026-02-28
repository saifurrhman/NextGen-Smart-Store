from rest_framework import viewsets, views
from rest_framework.response import Response
from .models import Delivery
from .serializers import DeliverySerializer
from apps.orders.models import Order
from django.db.models import Count, Q
from django.db.models.functions import TruncDate

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().order_by('-created_at')
    serializer_class = DeliverySerializer
    filterset_fields = ['status', 'delivery_boy']
    search_fields = ['tracking_id', 'order__id']

class DailyOperationsView(views.APIView):
    def get(self, request):
        # Aggregate stats by day
        stats = Order.objects.annotate(date=TruncDate('created_at')).values('date').annotate(
            total_orders=Count('id'),
            packed=Count('id', filter=Q(status='processing')),
            shipped=Count('id', filter=Q(status='shipped') | Q(status='delivered')),
            exceptions=Count('id', filter=Q(status='canceled'))
        ).order_by('-date')
        
        # Format for frontend
        results = []
        for s in stats:
            results.append({
                'date': s['date'].strftime('%b %d, %Y') if s['date'] else 'Unknown',
                'total_orders': s['total_orders'],
                'packed': s['packed'],
                'shipped': s['shipped'],
                'exceptions': s['exceptions'],
                'status': 'Active' if s['date'] == stats[0]['date'] else 'Completed'
            })
            
        return Response(results)
