from rest_framework import viewsets, permissions
from .models import Transaction, Payout
from .serializers import TransactionSerializer, PayoutSerializer
from core.pagination import MongoPagination

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.all().order_by('-created_at')
    serializer_class = TransactionSerializer
    pagination_class = MongoPagination
    permission_classes = [permissions.IsAuthenticated]

class PayoutViewSet(viewsets.ModelViewSet):
    queryset = Payout.objects.all().order_by('-created_at')
    serializer_class = PayoutSerializer
    pagination_class = MongoPagination
    permission_classes = [permissions.IsAuthenticated]
