from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer
from core.pagination import MongoPagination


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = MongoPagination
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'slug', 'description']

    def _get_by_slug(self, slug):
        """Helper: get a category by slug, return (obj, error_response)."""
        try:
            obj = Category.objects.filter(slug=slug).first()
        except Exception as e:
            return None, Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if obj is None:
            return None, Response({'detail': f'Category "{slug}" not found.'}, status=status.HTTP_404_NOT_FOUND)
        return obj, None

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        search = request.query_params.get('search', '').lower()
        is_active = request.query_params.get('is_active', '')

        if request.user and request.user.is_authenticated:
            filtered = list(queryset)
        else:
            filtered = [c for c in queryset if c.is_active]

        if search:
            filtered = [c for c in filtered if
                        search in c.name.lower() or
                        search in c.slug.lower()]

        if is_active != '':
            active_val = is_active.lower() == 'true'
            filtered = [c for c in filtered if c.is_active == active_val]

        page = self.paginate_queryset(filtered)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(filtered, many=True)
        return Response(serializer.data)

    def retrieve(self, request, slug=None, *args, **kwargs):
        obj, err = self._get_by_slug(slug or kwargs.get('slug'))
        if err:
            return err
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def destroy(self, request, slug=None, *args, **kwargs):
        obj, err = self._get_by_slug(slug or kwargs.get('slug'))
        if err:
            return err
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, slug=None, *args, **kwargs):
        obj, err = self._get_by_slug(slug or kwargs.get('slug'))
        if err:
            return err
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(obj, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
