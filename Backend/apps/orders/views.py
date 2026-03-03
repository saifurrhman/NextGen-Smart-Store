from rest_framework import generics, permissions
from .models import Order, Refund
from .serializers import OrderSerializer, RefundSerializer

class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

class RefundListView(generics.ListAPIView):
    queryset = Refund.objects.all().order_by('-created_at')
    serializer_class = RefundSerializer
    permission_classes = [permissions.IsAuthenticated]
