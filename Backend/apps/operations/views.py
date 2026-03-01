from rest_framework import viewsets, views
from rest_framework.response import Response
from .models import Delivery
from .serializers import DeliverySerializer
from apps.orders.models import Order
from django.db.models import Count, Q
from django.db.models.functions import TruncDate

from rest_framework.decorators import action
from rest_framework import status

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().order_by('-created_at')
    serializer_class = DeliverySerializer
    filterset_fields = ['status', 'delivery_boy']
    search_fields = ['tracking_id', 'order__id']

    @action(detail=True, methods=['post'], url_path='update-location')
    def update_location(self, request, pk=None):
        delivery = self.get_object()
        lat = request.data.get('latitude')
        lng = request.data.get('longitude')
        
        if lat is not None and lng is not None:
            delivery.latitude = lat
            delivery.longitude = lng
            delivery.save()
            return Response({'status': 'location updated'}, status=status.HTTP_200_OK)
        return Response({'error': 'latitude and longitude are required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='my-tasks')
    def my_tasks(self, request):
        if not request.user.is_authenticated or request.user.role != 'DELIVERY':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        include_history = request.query_params.get('include_history') == 'true'
        queryset = Delivery.objects.filter(delivery_boy=request.user).order_by('-created_at')
        
        if not include_history:
            queryset = queryset.exclude(status='delivered')
        else:
            queryset = queryset.filter(status='delivered')
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

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
