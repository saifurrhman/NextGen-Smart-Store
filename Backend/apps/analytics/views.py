from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum
from .models import TrafficLog
from .serializers import TrafficLogSerializer
from datetime import timedelta
from django.utils import timezone
import requests
import random
import calendar
from collections import defaultdict

from apps.orders.models import Order, OrderItem
from apps.products.models import Product
from apps.categories.models import Category
from apps.finance.models import Transaction

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
    ).count() > 0
    
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    now = timezone.now()
    seven_days_ago = now - timedelta(days=7)

    # 1. Top Level Metrics (Current vs Previous Period)
    orders_qs = Order.objects.filter(status='delivered')
    total_sales_agg = orders_qs.aggregate(total=Sum('total_amount'))['total'] or 0.0
    total_orders = orders_qs.count()
    
    # Previous period (last 7 days)
    prev_orders_qs = Order.objects.filter(status='delivered', created_at__gte=seven_days_ago)
    prev_sales_agg = prev_orders_qs.aggregate(total=Sum('total_amount'))['total'] or 0.0
    prev_orders = prev_orders_qs.count()

    # 1.1 Growth Calculations
    sales_growth = round(((float(total_sales_agg) - float(prev_sales_agg)) / float(prev_sales_agg) * 100), 1) if float(prev_sales_agg) > 0 else 0.0
    orders_growth = round(((total_orders - prev_orders) / prev_orders * 100), 1) if prev_orders > 0 else 0.0

    # 1.2 AOV (Average Order Value)
    aov = round(float(total_sales_agg) / total_orders, 2) if total_orders > 0 else 0.0
    prev_aov = round(float(prev_sales_agg) / prev_orders, 2) if prev_orders > 0 else 0.0
    aov_growth = round(((aov - prev_aov) / prev_aov * 100), 1) if prev_aov > 0 else 0.0

    # 1.3 Conversion Rate
    total_visits = TrafficLog.objects.count()
    prev_visits = TrafficLog.objects.filter(created_at__lt=seven_days_ago).count()
    
    conv_rate = round((total_orders / total_visits * 100), 2) if total_visits > 0 else 0.0
    prev_conv_rate = round((prev_orders / prev_visits * 100), 2) if prev_visits > 0 else 0.0
    conv_growth = round(((conv_rate - prev_conv_rate) / prev_conv_rate * 100), 1) if prev_conv_rate > 0 else 0.0

    # 1.4 Sales by Region (Aggregated from User Addresses)
    regions = ['Punjab', 'Sindh', 'KPK', 'Balochistan']
    region_sales = []
    total_regional_val = 0
    
    for r in regions:
        # Search for region name in address field
        r_sum = orders_qs.filter(user__address__icontains=r).aggregate(total=Sum('total_amount'))['total'] or 0.0
        if r_sum > 0:
            region_sales.append({'name': f"{r}, PK", 'value': float(r_sum)})
            total_regional_val += float(r_sum)
            
    # Calculate percentages
    formatted_regions = []
    if total_regional_val > 0:
        for rs in region_sales:
            formatted_regions.append({
                'name': rs['name'],
                'value': round((rs['value'] / total_regional_val) * 100),
                'color': 'bg-emerald-500' if 'Punjab' in rs['name'] else 'bg-blue-500'
            })
    else:
        # Fallback if no address data
        formatted_regions = [
            {'name': 'Other', 'value': 100, 'color': 'bg-gray-400'}
        ] if total_orders > 0 else []

    # 2. Dynamic Chart Data
    chart_data = []
    # (Existing chart logic stays same or simplified)
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    for i in range(6, -1, -1):
        target_date = now - timedelta(days=i)
        sof = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
        eof = sof + timedelta(days=1)
        day_sales = orders_qs.filter(created_at__gte=sof, created_at__lt=eof).aggregate(total=Sum('total_amount'))['total'] or 0.0
        chart_data.append({'name': days[target_date.weekday()], 'sales': float(day_sales)})

    # Simulation Fallback for empty DB (keep it but make it look realer)
    if total_orders == 0:
        total_sales_agg = 0.0
        sales_growth = 0.0
        total_orders = 0
        orders_growth = 0.0
        aov = 0.0
        aov_growth = 0.0
        conv_rate = 0.0
        conv_growth = 0.0
        formatted_regions = []

    # 3. Simulated Real-Time Active Users (Last 30 mins)
    active_users = [random.randint(2, 12) for _ in range(30)]
    active_users_total = sum(active_users) * 10 
        
    # 4. Recent Transactions
    recent_transactions = Transaction.objects.order_by('-created_at')[:5]
    transactions_data = []
    for i, txn in enumerate(recent_transactions, 1):
        transactions_data.append({
            'id': f"#{str(txn.order.id)[:5]}",
            'date': txn.created_at.strftime('%d %b | %I:%M %p').lower(),
            'status': txn.status.title(),
            'amount': float(txn.amount),
            'no': i
        })
        
    # 5. Top Products
    top_items = OrderItem.objects.values('product__id', 'product__title', 'product__price', 'product__category__name', 'product__stock').annotate(total_ordered=Sum('quantity')).order_by('-total_ordered')[:4]
    
    top_products_data = []
    for item in top_items:
        top_products_data.append({
            'id': f"#{str(item['product__id'])[:6]}",
            'name': item['product__title'] or 'Unknown',
            'category': item['product__category__name'] or 'General',
            'price': float(item['product__price'] or 0),
            'orders': item['total_ordered'],
            'stockStatus': 'Stock' if (item['product__stock'] or 0) > 0 else 'Stock out'
        })

    # 6. Categories & Recent Products for widgets
    db_categories = Category.objects.all()[:4]
    categories_data = [{'id': str(c.id), 'name': c.name} for c in db_categories]
    
    recent_products = Product.objects.order_by('-created_at')[:3]
    recent_products_data = []
    for p in recent_products:
        recent_products_data.append({
            'id': str(p.id),
            'name': p.title,
            'price': float(p.price)
        })

    # 7. Product Performance specific metrics
    total_products_count = Product.objects.count()
    low_stock_count = Product.objects.filter(stock__lte=5).count() # Threshold of 5
    
    # Aggregate top categories by sales volume
    category_sales = OrderItem.objects.values('product__category__name').annotate(sales_count=Sum('quantity')).order_by('-sales_count')[:4]
    top_categories_data = []
    max_category_sales = 0
    if category_sales:
        max_category_sales = category_sales[0]['sales_count']
        for cat in category_sales:
            top_categories_data.append({
                'name': cat['product__category__name'] or 'Uncategorized',
                'count': cat['sales_count'],
                'percentage': round((cat['sales_count'] / max_category_sales * 100)) if max_category_sales > 0 else 0
            })
        
    return Response({
        'overview': {
            'totalSales': float(total_sales_agg),
            'salesGrowth': sales_growth,
            'totalOrders': total_orders,
            'ordersGrowth': orders_growth,
            'aov': aov,
            'aovGrowth': aov_growth,
            'convRate': conv_rate,
            'convGrowth': conv_growth,
            'pendingOrders': Order.objects.filter(status='pending').count(),
            'canceledOrders': Order.objects.filter(status='canceled').count(),
            'totalProducts': total_products_count,
            'lowStock': low_stock_count
        },
        'report': chart_data,
        'activeUsers': {
            'history': active_users,
            'total': active_users_total
        },
        'transactions': transactions_data,
        'topProducts': top_products_data,
        'regions': formatted_regions,
        'topCategories': top_categories_data,
        'widgetData': {
            'categories': categories_data,
            'recentProducts': recent_products_data
        }
    })
