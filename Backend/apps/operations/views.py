from rest_framework import viewsets, views, permissions, status
from rest_framework.response import Response
from .models import Delivery, DailyStatsLog
from .serializers import DeliverySerializer, DailyStatsLogSerializer, ProductStockSerializer
from apps.orders.models import Order
from apps.products.models import Product
from apps.authentication.tokens import get_user_from_token
from django.db.models import Count, Q, F
from django.db.models.functions import TruncDate
from rest_framework.decorators import action

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().order_by('-created_at')
    serializer_class = DeliverySerializer
    permission_classes = [permissions.AllowAny]
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
        user = get_user_from_token(request)
        if not user or user.role != 'DELIVERY':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        include_history = request.query_params.get('include_history') == 'true'
        queryset = Delivery.objects.filter(delivery_boy=user).order_by('-created_at')
        
        if not include_history:
            queryset = queryset.exclude(status='delivered')
        else:
            queryset = queryset.filter(status='delivered')
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class DailyStatsLogViewSet(viewsets.ModelViewSet):
    queryset = DailyStatsLog.objects.all().order_by('-date')
    serializer_class = DailyStatsLogSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        # Merge manual logs with auto-generated order stats
        manual_logs = self.get_queryset()
        serializer = self.get_serializer(manual_logs, many=True)
        results = [dict(item, source='manual') for item in serializer.data]

        try:
            stats = Order.objects.annotate(date_only=TruncDate('created_at')).values('date_only').annotate(
                total_orders=Count('id'),
                packed=Count('id', filter=Q(status='processing')),
                shipped=Count('id', filter=Q(status='shipped') | Q(status='delivered')),
                exceptions=Count('id', filter=Q(status='canceled'))
            ).order_by('-date_only')

            for s in stats:
                results.append({
                    'id': f"auto-{s['date_only']}",
                    'date': s['date_only'].strftime('%Y-%m-%d') if s['date_only'] else 'Unknown',
                    'total_orders': s['total_orders'],
                    'packed': s['packed'],
                    'shipped': s['shipped'],
                    'exceptions': s['exceptions'],
                    'status': 'Completed',
                    'source': 'orders'
                })
        except Exception:
            pass

        return Response(results)

class InventoryAlertsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Fetch products where stock is less than or equal to min_stock
        low_stock_products = Product.objects.filter(
            Q(stock__lte=F('min_stock')) | Q(stock=0),
            is_active=True
        ).order_by('stock')
        
        serializer = ProductStockSerializer(low_stock_products, many=True)
        return Response(serializer.data)
