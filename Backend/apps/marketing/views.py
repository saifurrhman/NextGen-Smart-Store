from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Campaign, Promotion, Coupon, Ad
from .serializers import CampaignSerializer, PromotionSerializer, CouponSerializer, AdSerializer
from core.utils import get_mongo_db


def _mongo_list(collection_name, query=None):
    """Helper: list docs from a MongoDB collection safely, return list of dicts."""
    try:
        db = get_mongo_db()
        col = db[collection_name]
        docs = list(col.find(query or {}).sort('_id', -1).limit(200))
        from core.utils import sanitize_mongo_doc
        results = sanitize_mongo_doc(docs)
        return results, None
    except Exception as e:
        return [], str(e)


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        results, err = _mongo_list('marketing_campaign')
        return Response({'count': len(results), 'results': results, **(({'error': err}) if err else {})})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            db = get_mongo_db()
            db['marketing_campaign'].delete_one({'id': instance.id})
        except Exception:
            pass
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        results, err = _mongo_list('marketing_promotion')
        return Response({'count': len(results), 'results': results, **(({'error': err}) if err else {})})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            db = get_mongo_db()
            db['marketing_promotion'].delete_one({'id': instance.id})
        except Exception:
            pass
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        results, err = _mongo_list('marketing_coupon')
        return Response({'count': len(results), 'results': results, **(({'error': err}) if err else {})})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            db = get_mongo_db()
            db['marketing_coupon'].delete_one({'id': instance.id})
        except Exception:
            pass
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdViewSet(viewsets.ModelViewSet):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        results, err = _mongo_list('marketing_ad')
        return Response({'count': len(results), 'results': results, **(({'error': err}) if err else {})})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            db = get_mongo_db()
            db['marketing_ad'].delete_one({'id': instance.id})
        except Exception:
            pass
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
