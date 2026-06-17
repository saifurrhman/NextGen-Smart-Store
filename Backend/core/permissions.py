from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Permission for SUPER_ADMIN, SUB_ADMIN, or ADMIN roles.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if the user has is_staff or one of the admin roles (with or without underscores)
        role = str(getattr(request.user, 'role', '')).upper()
        return (
            request.user.is_staff or 
            role in ('SUPER_ADMIN', 'SUPERADMIN', 'SUB_ADMIN', 'SUBADMIN', 'ADMIN')
        )
