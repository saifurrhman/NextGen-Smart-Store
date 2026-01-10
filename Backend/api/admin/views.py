from rest_framework import views, status, permissions
from rest_framework.response import Response
from authentication.permissions import IsSuperAdmin
from vendors.models import VendorProfile
from authentication.models import User

class AdminDashboardStatsView(views.APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        total_revenue = 45230 # Mock
        active_users = User.objects.count()
        pending_vendors = VendorProfile.objects.filter(is_verified=False).count()
        
        return Response({
            "revenue": total_revenue,
            "active_users": active_users,
            "orders_today": 85, 
            "pending_vendors": pending_vendors,
            "system_health": "99.9%"
        })

class AdminVendorApprovalView(views.APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, pk):
        try:
            vendor = VendorProfile.objects.get(pk=pk)
            action = request.data.get('action') 
            
            if action == 'approve':
                vendor.is_verified = True
                vendor.save()
                return Response({"message": f"Vendor {vendor.store_name} approved."})
            elif action == 'reject':
                return Response({"message": "Vendor rejected."})
                
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
        except VendorProfile.DoesNotExist:
            return Response({"error": "Vendor not found"}, status=status.HTTP_404_NOT_FOUND)
