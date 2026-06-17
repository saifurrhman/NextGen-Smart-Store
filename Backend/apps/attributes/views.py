from rest_framework import viewsets, permissions
from .models import Attribute
from .serializers import AttributeSerializer
from core.pagination import MongoPagination
from django.http import Http404
from core.utils import get_mongo_db
from bson import ObjectId
from rest_framework.response import Response
from rest_framework import status

class AttributeViewSet(viewsets.ModelViewSet):
    queryset = Attribute.objects.all().order_by('-created_at')
    serializer_class = AttributeSerializer
    pagination_class = MongoPagination
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]
        
        # 1. Try standard Djongo ORM lookup with integer fallback
        try:
            return Attribute.objects.get(id=int(lookup_value))
        except (ValueError, TypeError):
            pass
            
        try:
            return Attribute.objects.get(id=lookup_value)
        except Exception:
            pass

        try:
            from bson import ObjectId
            return Attribute.objects.get(id=ObjectId(lookup_value))
        except Exception:
            pass

        # 2. Fallback to raw MongoDB lookup to bypass Djongo ORM limitations
        try:
            from core.utils import get_mongo_db
            from bson import ObjectId
            db = get_mongo_db()
            
            query_ids = [lookup_value]
            try:
                query_ids.append(ObjectId(lookup_value))
            except Exception:
                pass
            try:
                query_ids.append(int(lookup_value))
            except Exception:
                pass
                
            doc = db['attributes_attribute'].find_one({
                '$or': [
                    {'_id': {'$in': query_ids}},
                    {'id': {'$in': query_ids}},
                    {'id': lookup_value},
                    {'id': str(lookup_value)}
                ]
            })
            
            if doc:
                obj = Attribute(
                    id=doc.get('_id'),
                    name=doc.get('name'),
                    slug=doc.get('slug'),
                    terms=doc.get('terms'),
                    is_active=doc.get('is_active', True)
                )
                self.check_object_permissions(self.request, obj)
                return obj
        except Exception:
            pass

        raise Http404("Not found.")

    def destroy(self, request, *args, **kwargs):
        try:
            from core.utils import get_mongo_db
            from bson import ObjectId
            db = get_mongo_db()
            
            lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
            lookup_value = self.kwargs[lookup_url_kwarg]
            
            query_ids = [lookup_value]
            try:
                query_ids.append(ObjectId(lookup_value))
            except Exception:
                pass
            try:
                query_ids.append(int(lookup_value))
            except Exception:
                pass
                
            result = db['attributes_attribute'].delete_one({
                '$or': [
                    {'_id': {'$in': query_ids}},
                    {'id': {'$in': query_ids}},
                    {'id': lookup_value},
                    {'id': str(lookup_value)}
                ]
            })
            
            if result.deleted_count == 0:
                return Response({'detail': 'Attribute not found.'}, status=status.HTTP_404_NOT_FOUND)
                
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'detail': f'Delete failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        slug = request.data.get('slug')
        if slug:
            try:
                db = get_mongo_db()
                if db['attributes_attribute'].count_documents({'slug': slug}) > 0:
                    return Response({'detail': f'An attribute with the slug "{slug}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception:
                pass
                
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({'detail': f'Failed to create attribute: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        slug = request.data.get('slug')
        instance = self.get_object()
        if slug and slug != instance.slug:
            try:
                db = get_mongo_db()
                if db['attributes_attribute'].count_documents({'slug': slug}) > 0:
                    return Response({'detail': f'An attribute with the slug "{slug}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception:
                pass
                
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response({'detail': f'Failed to update attribute: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
