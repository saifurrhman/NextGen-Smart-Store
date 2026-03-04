from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Transaction, Payout, FinancialReport
from .serializers import TransactionSerializer, PayoutSerializer, FinancialReportSerializer
from core.pagination import MongoPagination
from django.db.models import Sum

from core.utils import sanitize_mongo_doc, get_mongo_db

def _mongo_list(collection_name, query=None):
    try:
        db = get_mongo_db()
        docs = list(db[collection_name].find(query or {}).sort('_id', -1).limit(200))
        return sanitize_mongo_doc(docs), None
    except Exception as e:
        return [], str(e)

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        results, err = _mongo_list('finance_transaction')
        return Response({'count': len(results), 'results': results, **(({'error': err}) if err else {})})

class PayoutViewSet(viewsets.ModelViewSet):
    queryset = Payout.objects.all()
    serializer_class = PayoutSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        results, err = _mongo_list('finance_payout')
        return Response({'count': len(results), 'results': results, **(({'error': err}) if err else {})})

class FinancialReportViewSet(viewsets.ModelViewSet):
    queryset = FinancialReport.objects.all()
    serializer_class = FinancialReportSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        results, err = _mongo_list('finance_financialreport')
        return Response({'count': len(results), 'results': results, **(({'error': err}) if err else {})})

    def perform_create(self, serializer):
        start_date = self.request.data.get('start_date')
        end_date = self.request.data.get('end_date')
        report_type = self.request.data.get('report_type')
        
        # Calculate snapshot data based on range
        summary = {
            'revenue': 0,
            'payouts': 0,
            'tax': 0,
            'transactions_count': 0
        }
        
        # Simple aggregation for demonstration
        txns = Transaction.objects.filter(created_at__date__gte=start_date, created_at__date__lte=end_date)
        summary['revenue'] = txns.filter(status='success').aggregate(Sum('amount'))['amount__sum'] or 0
        summary['transactions_count'] = txns.count()
        
        payouts = Payout.objects.filter(created_at__date__gte=start_date, created_at__date__lte=end_date)
        summary['payouts'] = payouts.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Approximate tax (e.g. 5% if not explicitly tracked per txn)
        summary['tax'] = float(summary['revenue']) * 0.05
        
        serializer.save(
            created_by=self.request.user if self.request.user.is_authenticated else None,
            status='generated',
            data_snapshot=summary
        )
