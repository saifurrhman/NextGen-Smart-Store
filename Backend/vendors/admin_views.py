from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authentication.permissions import IsSuperAdmin
from .models import VendorProfile
from authentication.models import User
# from orders.models import Order # When ready

class AdminDashboardStatsView(views.APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        total_revenue = 45230 # Mock for now
        active_users = User.objects.count()
        pending_vendors = VendorProfile.objects.filter(is_verified=False).count()
        # orders_today = Order.objects.filter(created_at__date=today).count()
        
        return Response({
            "revenue": total_revenue,
            "active_users": active_users,
            "orders_today": 85, # Mock
            "pending_vendors": pending_vendors,
            "system_health": "99.9%"
        })

class AdminVendorApprovalView(views.APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, pk):
        try:
            vendor = VendorProfile.objects.get(pk=pk)
            action = request.data.get('action') # 'approve' or 'reject'
            
            if action == 'approve':
                vendor.is_verified = True
                vendor.save()
                return Response({"message": f"Vendor {vendor.store_name} approved."})
            elif action == 'reject':
                # vendor.delete() or mark rejected
                return Response({"message": "Vendor rejected."})
                
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
        except VendorProfile.DoesNotExist:
            return Response({"error": "Vendor not found"}, status=status.HTTP_404_NOT_FOUND)
