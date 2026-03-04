from rest_framework import generics, permissions, viewsets, status
from .models import Order, Refund, OrderReport
from .serializers import OrderSerializer, RefundSerializer, OrderReportSerializer
from rest_framework.response import Response
from core.utils import get_mongo_db
from bson import ObjectId


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        """
        Use raw PyMongo to avoid Djongo order_by() + filter crashes and timeouts.
        """
        try:
            db = get_mongo_db()
            collection = db['orders_order']

            query = {}
            # Status filter
            order_status = request.query_params.get('status', '')
            if order_status:
                query['status'] = order_status

            # Payment status filter
            payment_status = request.query_params.get('payment_status', '')
            if payment_status:
                query['payment_status'] = payment_status

            # Search
            search = request.query_params.get('search', '').strip()
            if search:
                query['$or'] = [
                    {'customer_name': {'$regex': search, '$options': 'i'}},
                    {'customer_email': {'$regex': search, '$options': 'i'}},
                ]

            # Pagination
            try:
                page = int(request.query_params.get('page', 1))
                page_size = int(request.query_params.get('page_size', 20))
            except (ValueError, TypeError):
                page = 1
                page_size = 20

            skip = (page - 1) * page_size
            total = collection.count_documents(query)
            docs = list(collection.find(query).sort('_id', -1).skip(skip).limit(page_size))

            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)

            return Response({
                'count': total,
                'page': page,
                'page_size': page_size,
                'results': results,
            })
        except Exception as e:
            # Fallback: plain ORM without ordering
            try:
                qs = list(Order.objects.all())
                serializer = self.get_serializer(qs, many=True)
                return Response({'count': len(qs), 'results': serializer.data})
            except Exception as e2:
                return Response({'count': 0, 'results': [], 'error': str(e2)})


class RefundListView(generics.ListAPIView):
    queryset = Refund.objects.all()
    serializer_class = RefundSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        """Use raw PyMongo to avoid Djongo order_by crash."""
        try:
            db = get_mongo_db()
            collection = db['orders_refund']
            docs = list(collection.find({}).sort('_id', -1).limit(100))
            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)
            return Response({'count': len(results), 'results': results})
        except Exception as e:
            return Response({'count': 0, 'results': [], 'error': str(e)})


class OrderReportViewSet(viewsets.ModelViewSet):
    queryset = OrderReport.objects.all()
    serializer_class = OrderReportSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        """Use raw PyMongo to avoid Djongo order_by crash."""
        try:
            db = get_mongo_db()
            collection = db['orders_orderreport']
            docs = list(collection.find({}).sort('_id', -1).limit(100))
            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)
            return Response({'count': len(results), 'results': results})
        except Exception as e:
            return Response({'count': 0, 'results': [], 'error': str(e)})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            db = get_mongo_db()
            result = db['orders_orderreport'].delete_one({'_id': ObjectId(str(instance.id))})
            if result.deleted_count == 0:
                return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
