from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from django.db import models
from .models import Category
from .serializers import CategorySerializer
from core.utils import get_mongo_db


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
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
        """
        Use raw PyMongo to avoid Djongo's broken .order_by() + pagination.
        """
        try:
            db = get_mongo_db()
            collection = db['categories_category']

            query = {}
            search = request.query_params.get('search', '').strip().lower()
            is_active_param = request.query_params.get('is_active', '')

            if search:
                query['$or'] = [
                    {'name': {'$regex': search, '$options': 'i'}},
                    {'slug': {'$regex': search, '$options': 'i'}},
                    {'description': {'$regex': search, '$options': 'i'}},
                ]

            if is_active_param != '':
                query['is_active'] = (is_active_param.lower() == 'true')
            elif not (request.user and request.user.is_staff):
                query['is_active'] = True

            # Pagination
            try:
                page = int(request.query_params.get('page', 1))
                page_size = int(request.query_params.get('page_size', 50))
            except (ValueError, TypeError):
                page = 1
                page_size = 50

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
            # Fallback to ORM without ordering
            try:
                qs = list(Category.objects.all())
                serializer = self.get_serializer(qs, many=True)
                return Response({'count': len(qs), 'results': serializer.data})
            except Exception as e2:
                return Response({'count': 0, 'results': [], 'error': str(e2)})

    def retrieve(self, request, slug=None, *args, **kwargs):
        obj, err = self._get_by_slug(slug or kwargs.get('slug'))
        if err:
            return err
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def destroy(self, request, slug=None, *args, **kwargs):
        target_slug = slug or kwargs.get('slug')
        obj, err = self._get_by_slug(target_slug)
        if err:
            return err

        # Djongo sets id=None on fetched instances so ORM .delete() is broken.
        # Use raw PyMongo to delete directly.
        try:
            db = get_mongo_db()
            result = db['categories_category'].delete_one({'slug': target_slug})
            if result.deleted_count == 0:
                return Response({'detail': f'Category "{target_slug}" not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': f'Delete failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

