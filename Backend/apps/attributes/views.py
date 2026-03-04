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
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]
        
        try:
            # Try parsing as integer for legacy entries created before ObjectId migration
            obj = queryset.get(**{self.lookup_field: int(lookup_value)})
        except ValueError:
            try:
                # Fallback to normal string lookup (ObjectId)
                obj = queryset.get(**{self.lookup_field: lookup_value})
            except Exception:
                raise Http404("Not found.")
        except Exception:
            raise Http404("Not found.")
            
        self.check_object_permissions(self.request, obj)
        return obj

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            db = get_mongo_db()
            # Attributes are usually stored in 'attributes_attribute' collection
            result = db['attributes_attribute'].delete_one({'_id': ObjectId(str(instance.id))})
            if result.deleted_count == 0:
                return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
