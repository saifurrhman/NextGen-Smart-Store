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
                        'amount': float(order_total),
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
                        'revenue': float(product_sales[pid]['revenue']),
                        'stock': pdoc.get('stock', 0)
                    })

            # 5. Chart Data: Real Last 12 Days Sales
            chart_data = [0] * 12
            now = timezone.now()
            
            for item in vendor_order_items:
                oid = item.get('order_id')
                if not oid: continue
                # find the order to get the date
                o = next((o_doc for o_doc in orders if o_doc['_id'] == oid), None) if 'orders' in locals() else orders_col.find_one({'_id': oid})
                if o and o.get('created_at'):
                    dt = o.get('created_at')
                    days_ago = (now.date() - dt.date()).days
                    if 0 <= days_ago < 12:
                        idx = 11 - days_ago # 11 is today, 0 is 11 days ago
                        q = item.get('quantity', 1)
                        try: p = float(str(item.get('price', 0)))
                        except: p = 0.0
                        chart_data[idx] += (p * q)
            
            max_val = max(chart_data) if chart_data else 1
            if max_val == 0:
                chart_percentages = [0] * 12
            else:
                chart_percentages = [int((val / max_val) * 100) for val in chart_data]

            # 6. Calculate REAL rating from reviews
            reviews_col = db['reviews_review']
            vendor_reviews = list(reviews_col.find({'product_id': {'$in': product_ids}}))
            if vendor_reviews:
                avg_rating = sum(r.get('rating', 5) for r in vendor_reviews) / len(vendor_reviews)
                raw_rating = round(avg_rating, 1)
            else:
                raw_rating = 0

            return Response({
                'stats': {
                    'revenue': float(total_revenue),
                    'orders': total_orders,
                    'products': active_listings,
                    'rating': raw_rating
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
                    'price': float(price_val),
                    'stock': stock,
                    'status': status_text,
                    'image': image_url,
                    'sku': doc.get('sku', f"SKU-{str(doc['_id'])[-4:].upper()}")
                })
                
            return Response({'results': results})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        user_id = request.user.id
        try:
            from apps.products.serializers import ProductSerializer
            from apps.products.models import ProductImage
            
            # Extract gallery images before serializing
            gallery_images = request.FILES.getlist('gallery')
            
            data = request.data.copy()
            serializer = ProductSerializer(data=data)
            if serializer.is_valid():
                # Read-only vendor field is bypassed by manual assignment
                product = serializer.save(vendor_id=user_id)
                
                # Save gallery images
                for img in gallery_images:
                    ProductImage.objects.create(product=product, image=img)
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
                    'total': float(order_total),
                    'status': status_val,
                    'date': date_str,
                    'type': 'Standard' # Mocking shipping type as it's not in base model easily
                })
                
            return Response({'results': results})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VendorEarningsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        try:
            db = get_mongo_db()
            products_col = db['products_product']
            orders_col = db['orders_order']
            order_items_col = db['orders_orderitem']
            payouts_col = db['finance_payout'] # Using convention
            
            # Find vendor products first
            vendor_products = list(products_col.find({'vendor_id': user_id}))
            product_ids = [p['_id'] for p in vendor_products]
            
            # Gather associated order items
            vendor_order_items = list(order_items_col.find({'product_id': {'$in': product_ids}}))
            
            # Group items by order to cross-check status
            items_by_order = {}
            for item in vendor_order_items:
                oid = item.get('order_id')
                if oid:
                    if oid not in items_by_order:
                        items_by_order[oid] = []
                    items_by_order[oid].append(item)
                    
            order_ids = list(items_by_order.keys())
            
            # Fetch affected orders
            orders = list(orders_col.find({'_id': {'$in': order_ids}}))
            order_dict = {o['_id']: o for o in orders}
            
            pending_clearance = 0.0
            lifetime_earned = 0.0
            available_payout = 0.0
            
            ledger_transactions = []
            
            # Calculate Revenue 
            for oid, items in items_by_order.items():
                order = order_dict.get(oid)
                if not order: continue
                
                status = (order.get('status') or 'pending').lower()
                
                order_earn = 0.0
                for item in items:
                    q = item.get('quantity', 1)
                    try: p = float(str(item.get('price', 0)))
                    except: p = 0.0
                    order_earn += (p * q)
                    
                lifetime_earned += order_earn
                
                dt = order.get('created_at')
                date_str = dt.strftime('%b %d, %Y') if dt else 'N/A'
                
                is_cleared = status in ['completed', 'delivered', 'shipped'] # Marking shipped as cleared for dashboard simplicity
                
                if is_cleared:
                    available_payout += order_earn
                    ledger_transactions.append({
                        'id': f"#TRX-{str(oid)[-4:].upper()}A",
                        'type': 'Order Earned',
                        'method': f"Sale #ORD-{str(oid)[-4:].upper()}",
                        'amount': float(order_earn),
                        'status': 'Completed',
                        'date': date_str,
                        'raw_date': dt
                    })
                else:
                    pending_clearance += order_earn
                    ledger_transactions.append({
                        'id': f"#TRX-{str(oid)[-4:].upper()}P",
                        'type': 'Order Earned',
                        'method': f"Sale #ORD-{str(oid)[-4:].upper()}",
                        'amount': float(order_earn),
                        'status': 'Processing',
                        'date': date_str,
                        'raw_date': dt
                    })
            
            # Payouts Tracking
            payouts = list(payouts_col.find({'vendor_id': user_id}))
            total_withdrawn = 0.0
            
            for p in payouts:
                try: p_amt = float(str(p.get('amount', 0)))
                except: p_amt = 0.0
                total_withdrawn += p_amt
                
                p_status = (p.get('status') or 'pending').lower()
                dt = p.get('created_at')
                
                ledger_transactions.append({
                    'id': f"#TRX-P{str(p['_id'])[-4:].upper()}",
                    'type': 'Payout',
                    'method': 'Bank Transfer',
                    'amount': -float(p_amt),
                    'status': p_status.title(),
                    'date': dt.strftime('%b %d, %Y') if dt else 'N/A',
                    'raw_date': dt
                })
                
            available_payout -= total_withdrawn
            if available_payout < 0: available_payout = 0.0
            
            # Sort ledger by date descending
            ledger_transactions.sort(key=lambda x: x.get('raw_date') or timezone.now(), reverse=True)
            
            # Clean out raw_date for frontend response
            for t in ledger_transactions:
                t.pop('raw_date', None)

            # Mock next payout date based on logic (Next Friday)
            import datetime
            now = timezone.now()
            days_ahead = 4 - now.weekday() # Friday
            if days_ahead <= 0: days_ahead += 7
            next_payout = now + datetime.timedelta(days_ahead)

            return Response({
                'overview': {
                    'available': float(available_payout),
                    'pending': float(pending_clearance),
                    'lifetime': float(lifetime_earned),
                    'nextPayout': next_payout.strftime('%b %d, %Y'),
                    'activePromos': 0,
                    'weeklyGrowth': "+0.0%" # Requires multi-week snapshot logic to make real, mocking for UI until analytics are fully built
                },
                'transactions': ledger_transactions
            })
            
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
class VendorReviewsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        try:
            db = get_mongo_db()
            products_col = db['products_product']
            reviews_col = db['reviews_review']
            
            # 1. Get vendor products
            vendor_products = list(products_col.find({'vendor_id': user_id}))
            product_ids = [p['_id'] for p in vendor_products]
            product_map = {str(p['_id']): p.get('title', 'Product') for p in vendor_products}
            
            # 2. Get reviews for these products
            reviews = list(reviews_col.find({'product_id': {'$in': product_ids}}).sort('_id', -1))
            
            # 3. Calculate metrics
            total_reviews = len(reviews)
            avg_rating = sum(r.get('rating', 5) for r in reviews) / total_reviews if total_reviews > 0 else 0
            positive_sentiment = sum(1 for r in reviews if r.get('rating', 0) >= 4)
            
            # Mocking response rate for now based on 'is_approved' or similar logic if needed,
            # but let's just use 100% if they are all approved or similar.
            # Usually requires a 'replies' collection which might not exist in base.
            response_rate = "94.2%" 
            
            # 4. Format review list
            review_list = []
            for r in reviews:
                dt = r.get('created_at', timezone.now())
                # Humanize time roughly
                time_diff = timezone.now() - dt
                if time_diff.days > 0:
                    time_str = f"{time_diff.days} days ago"
                elif time_diff.seconds > 3600:
                    time_str = f"{time_diff.seconds // 3600} hours ago"
                else:
                    time_str = "Recently"

                review_list.append({
                    'id': str(r['_id']),
                    'user': r.get('user_email', 'Anonymous').split('@')[0].capitalize(),
                    'rating': r.get('rating', 5),
                    'comment': r.get('comment', ''),
                    'date': time_str,
                    'product': product_map.get(str(r.get('product_id')), 'Product'),
                    'status': 'Replied' if r.get('is_approved') else 'Pending'
                })

            return Response({
                'metrics': {
                    'avgRating': f"{avg_rating:.1f} / 5.0",
                    'avgRatingValue': round(avg_rating, 1),
                    'positiveSentiment': f"{positive_sentiment} Reviews",
                    'sentimentPercentage': f"{int((positive_sentiment/total_reviews)*100)}%" if total_reviews > 0 else "0%",
                    'responseRate': response_rate,
                    'totalReviews': total_reviews
                },
                'reviews': review_list
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VendorProductDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user_id):
        from apps.products.models import Product
        return Product.objects.filter(pk=pk, vendor_id=user_id).first()

    def get(self, request, pk, *args, **kwargs):
        product = self.get_object(pk, request.user.id)
        if not product:
            return Response({'error': 'Product not found or access denied.'}, status=status.HTTP_404_NOT_FOUND)
        
        from apps.products.serializers import ProductSerializer
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def patch(self, request, pk, *args, **kwargs):
        user_id = request.user.id
        try:
            from apps.products.models import Product, ProductImage
            from apps.products.serializers import ProductSerializer
            
            product = self.get_object(pk, user_id)
            if not product:
                return Response({'error': 'Product not found or access denied.'}, status=status.HTTP_404_NOT_FOUND)
            
            # Extract gallery images
            gallery_images = request.FILES.getlist('gallery')
            
            serializer = ProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                
                # Handle new gallery images
                for img in gallery_images:
                    ProductImage.objects.create(product=product, image=img)
                
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk, *args, **kwargs):
        user_id = request.user.id
        try:
            from apps.products.models import Product
            product = self.get_object(pk, user_id)
            if not product:
                return Response({'error': 'Product not found or access denied.'}, status=status.HTTP_404_NOT_FOUND)
            
            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VendorGalleryImageDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk, *args, **kwargs):
        from apps.products.models import ProductImage
        try:
            img = ProductImage.objects.filter(pk=pk, product__vendor=request.user).first()
            if not img:
                return Response({'error': 'Image not found or access denied.'}, status=status.HTTP_404_NOT_FOUND)
            img.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
