from rest_framework import viewsets, permissions
from .models import Category
from .serializers import CategorySerializer
from core.pagination import MongoPagination

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = MongoPagination
    permission_classes = [permissions.AllowAny] # Allow public access to view categories
    lookup_field = 'slug'

    def list(self, request, *args, **kwargs):
        """
        Overridden to filter by is_active in Python to avoid Djongo/MongoDB
        issues with filtered count queries.
        """
        queryset = self.get_queryset()
        # Filter in Python
        active_categories = [c for c in queryset if c.is_active]
        
        page = self.paginate_queryset(active_categories)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(active_categories, many=True)
        return Response(serializer.data)
