from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import VendorProfile
from .serializers import VendorProfileSerializer
from core.pagination import MongoPagination
from core.utils import get_mongo_db
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from bson import ObjectId

class VendorDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        try:
            db = get_mongo_db()
            products_col = db['products_product']
            orders_col = db['orders_order']
            order_items_col = db['orders_orderitem']

            # 1. Total Products and Active Listings (In Stock)
            vendor_products = list(products_col.find({'vendor_id': user_id}))
            product_ids = [p['_id'] for p in vendor_products]
            total_products = len(product_ids)
            active_listings = sum(1 for p in vendor_products if p.get('stockStatus', p.get('stock_status')) == 'IN_STOCK' or p.get('stock', 0) > 0)
            
            # Simple fallback for variations in DB status spelling
            if active_listings == 0 and total_products > 0:
                active_listings = sum(1 for p in vendor_products if p.get('stock', 0) > 0)

            # 2. Revenue & Sales Volume
            # Fast way: find all order items for this vendor's products, then group by order_id
            vendor_order_items = list(order_items_col.find({'product_id': {'$in': product_ids}}))
            
            total_revenue = 0.0
            sales_volume = 0
            
            order_ids_set = set()
            for item in vendor_order_items:
                quantity = item.get('quantity', 1)
                price = item.get('price', 0)
                try:
                    price = float(str(price))
                except (ValueError, TypeError):
                    price = 0.0
                    
                total_revenue += (price * quantity)
                sales_volume += quantity
                if 'order_id' in item:
                    order_ids_set.add(item['order_id'])

            total_orders = len(order_ids_set)
            rating = "4.8/5" # Mockrating until reviews are implemented
            
            # 3. Recent Orders
            recent_orders = []
            if order_ids_set:
                orders = list(orders_col.find({'_id': {'$in': list(order_ids_set)}}).sort('created_at', -1).limit(5))
                for idx, o in enumerate(orders):
                    # Find which items in this order belong to vendor
                    items_in_order = [itm for itm in vendor_order_items if itm.get('order_id') == o['_id']]
                    if not items_in_order: continue
                    
                    product_id = items_in_order[0].get('product_id')
                    product_title = next((p.get('title', 'Product') for p in vendor_products if p['_id'] == product_id), 'Product')
                    if len(items_in_order) > 1:
                        product_title = f"{product_title} + {len(items_in_order)-1} more"

                    order_total = sum(float(str(itm.get('price', 0))) * itm.get('quantity', 1) for itm in items_in_order)
                    
                    dt = o.get('created_at')
                    time_str = dt.strftime('%d %b, %H:%M') if dt else 'N/A'
                    
                    recent_orders.append({
                        'id': f"#ORD-{str(o['_id'])[-4:].upper()}",
                        'customer': o.get('customer_name') or o.get('customer_email') or f"User {o.get('user_id')}",
                        'product': product_title,
                        'amount': f"${order_total:,.2f}",
                        'status': (o.get('status') or 'pending').title(),
                        'time': time_str,
                        'raw_date': dt
                    })

            # 4. Top Products
            top_products = []
            product_sales = {} # product_id -> {'sales': 0, 'revenue': 0}
            for item in vendor_order_items:
                pid = item.get('product_id')
                q = item.get('quantity', 1)
                try:
                    p = float(str(item.get('price', 0)))
                except:
                    p = 0.0
                if pid not in product_sales:
                    product_sales[pid] = {'sales': 0, 'revenue': 0.0}
                product_sales[pid]['sales'] += q
                product_sales[pid]['revenue'] += (p * q)

            sorted_pids = sorted(product_sales.keys(), key=lambda x: product_sales[x]['sales'], reverse=True)[:5]
            
            for pid in sorted_pids:
                pdoc = next((p for p in vendor_products if p['_id'] == pid), None)
                if pdoc:
                    top_products.append({
                        'name': pdoc.get('title', 'Unknown'),
                        'sales': product_sales[pid]['sales'],
                        'revenue': f"${product_sales[pid]['revenue']:,.2f}",
                        'stock': pdoc.get('stock', 0)
                    })

            # 5. Chart Data (Last 12 Days mockup based on total sales)
            # Dividing total sales somewhat randomly to make chart look alive
            chart_data = []
            base_val = total_revenue / 12 if total_revenue > 0 else 50
            import random
            for i in range(12):
                if total_revenue == 0:
                    chart_data.append(random.randint(20, 80))
                else:
                    # Distribute sales with some noise
                    val = base_val * (0.5 + random.random())
                    # Convert to percentage relative to max
                    chart_data.append(val)
            
            max_val = max(chart_data) if chart_data else 1
            chart_percentages = [int((val / max_val) * 100) for val in chart_data]

            return Response({
                'stats': {
                    'revenue': f"${total_revenue:,.2f}",
                    'orders': str(total_orders),
                    'products': str(active_listings),
                    'rating': rating
                },
                'chart': chart_percentages,
                'topProducts': top_products,
                'recentOrders': recent_orders
            })

        except Exception as e:
             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VendorProductsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        try:
            db = get_mongo_db()
            collection = db['products_product']
            
            query = {'vendor_id': user_id}
            
            search = request.query_params.get('search', '').strip()
            if search:
                query['$or'] = [
                    {'title': {'$regex': search, '$options': 'i'}},
                    {'sku': {'$regex': search, '$options': 'i'}}
                ]
                
            docs = list(collection.find(query).sort('_id', -1))
            
            # Format docs for frontend
            results = []
            import os
            for doc in docs:
                image_url = ''
                if doc.get('main_image'):
                    # VERY basic path joining. In prod use request.build_absolute_uri
                    image_url = f"/media/{doc['main_image']}"
                else:
                    image_url = 'https://ui-avatars.com/api/?name=Product&background=random'
                    
                price = doc.get('price', 0)
                try:
                    price_val = float(str(price))
                except:
                    price_val = 0.0

                stock = doc.get('stock', 0)
                if stock > 5:
                    status_text = 'In Stock'
                elif stock > 0:
                    status_text = 'Low Stock'
                else:
                    status_text = 'Out of Stock'
                    
                cat_id = doc.get('category_id')
                category_name = 'General'
                if cat_id:
                    cat_doc = db['categories_category'].find_one({'_id': cat_id})
                    if cat_doc:
                        category_name = cat_doc.get('name', 'General')
                
                results.append({
                    'id': str(doc['_id']),
                    'name': doc.get('title', 'Unknown Product'),
                    'category': category_name,
                    'price': f"${price_val:,.2f}",
                    'stock': stock,
                    'status': status_text,
                    'image': image_url,
                    'sku': doc.get('sku', f"SKU-{str(doc['_id'])[-4:].upper()}")
                })
                
            return Response({'results': results})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VendorOrdersListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        try:
            db = get_mongo_db()
            products_col = db['products_product']
            orders_col = db['orders_order']
            order_items_col = db['orders_orderitem']
            
            # 1. Get vendor products
            vendor_products = list(products_col.find({'vendor_id': user_id}))
            product_ids = [p['_id'] for p in vendor_products]
            
            # 2. Get order items for these products
            vendor_order_items = list(order_items_col.find({'product_id': {'$in': product_ids}}))
            
            # Group items by order
            items_by_order = {} # order_id -> list of items
            for item in vendor_order_items:
                oid = item.get('order_id')
                if oid:
                    if oid not in items_by_order:
                        items_by_order[oid] = []
                    items_by_order[oid].append(item)
                    
            order_ids = list(items_by_order.keys())
            
            filter_status = request.query_params.get('filter', 'All Orders')
            
            query = {'_id': {'$in': order_ids}}
            
            if filter_status and filter_status != 'All Orders':
                # Map frontend tabs to backend status
                status_map = {
                    'Pending': 'pending',
                    'Processing': 'processing',
                    'Dispatched': 'shipped',
                    'Completed': 'delivered'
                }
                mapped = status_map.get(filter_status)
                if mapped:
                    query['status'] = mapped
                    
            docs = list(orders_col.find(query).sort('created_at', -1))
            
            results = []
            for o in docs:
                oid = o['_id']
                items = items_by_order.get(oid, [])
                
                total_items = sum(itm.get('quantity', 1) for itm in items)
                order_total = sum(float(str(itm.get('price', 0))) * itm.get('quantity', 1) for itm in items)
                
                dt = o.get('created_at')
                date_str = dt.strftime('%b %d, %Y') if dt else 'N/A'
                
                status_val = (o.get('status') or 'pending').title()
                if status_val == 'Shipped':
                    status_val = 'Dispatched'
                
                results.append({
                    'id': f"#ORD-{str(oid)[-4:].upper()}",
                    'customer': o.get('customer_name') or f"User {o.get('user_id')}",
                    'email': o.get('customer_email') or 'N/A',
                    'items': total_items,
                    'total': f"${order_total:,.2f}",
                    'status': status_val,
                    'date': date_str,
                    'type': 'Standard' # Mocking shipping type as it's not in base model easily
                })
                
            return Response({'results': results})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VendorViewSet(viewsets.ModelViewSet):
    queryset = VendorProfile.objects.all().order_by('-created_at')
    serializer_class = VendorProfileSerializer
    pagination_class = MongoPagination
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        vendor = self.get_object()
        vendor.status = 'active'
        vendor.save()
        
        # Also ensure user role is VENDOR (though it should be already)
        user = vendor.user
        user.role = 'VENDOR'
        user.save()
        
        return Response({'status': 'vendor approved'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        vendor = self.get_object()
        vendor.status = 'rejected'
        vendor.save()
        return Response({'status': 'vendor rejected'}, status=status.HTTP_200_OK)
