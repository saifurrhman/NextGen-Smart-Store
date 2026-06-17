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

    def create(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            data = request.data.copy()
            # Generate a simple incremental ID or use ObjectId (for simplicity we use incremental id if none)
            max_doc = db['marketing_campaign'].find_one(sort=[("id", -1)])
            new_id = (max_doc['id'] + 1) if max_doc and 'id' in max_doc else 1
            data['id'] = new_id
            
            # Default values
            data['platform'] = data.get('platform', 'google')
            data['impressions'] = data.get('impressions', 0)
            data['clicks'] = data.get('clicks', 0)
            data['conversions'] = data.get('conversions', 0)
            
            from datetime import datetime
            data['created_at'] = datetime.now()
            
            db['marketing_campaign'].insert_one(data)
            data['_id'] = str(data['_id'])
            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            data = request.data.copy()
            pk = kwargs.get('pk')
            
            if 'id' in data: del data['id']
            if '_id' in data: del data['_id']
            
            from bson import ObjectId
            query = {'_id': ObjectId(pk)} if len(str(pk)) == 24 else {'id': int(pk)}
            
            db['marketing_campaign'].update_one(query, {'$set': data})
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            pk = kwargs.get('pk')
            from bson import ObjectId
            query = {'_id': ObjectId(pk)} if len(str(pk)) == 24 else {'id': int(pk)}
            db['marketing_campaign'].delete_one(query)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        results, err = _mongo_list('marketing_promotion')
        return Response({'count': len(results), 'results': results, **(({'error': err}) if err else {})})

    def create(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            data = request.data.copy()
            max_doc = db['marketing_promotion'].find_one(sort=[("id", -1)])
            data['id'] = (max_doc['id'] + 1) if max_doc and 'id' in max_doc else 1
            db['marketing_promotion'].insert_one(data)
            data['_id'] = str(data['_id'])
            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            data = request.data.copy()
            pk = kwargs.get('pk')
            if 'id' in data: del data['id']
            if '_id' in data: del data['_id']
            from bson import ObjectId
            query = {'_id': ObjectId(pk)} if len(str(pk)) == 24 else {'id': int(pk)}
            db['marketing_promotion'].update_one(query, {'$set': data})
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            pk = kwargs.get('pk')
            from bson import ObjectId
            query = {'_id': ObjectId(pk)} if len(str(pk)) == 24 else {'id': int(pk)}
            db['marketing_promotion'].delete_one(query)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        results, err = _mongo_list('marketing_coupon')
        return Response({'count': len(results), 'results': results, **(({'error': err}) if err else {})})

    def create(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            data = request.data.copy()
            max_doc = db['marketing_coupon'].find_one(sort=[("id", -1)])
            data['id'] = (max_doc['id'] + 1) if max_doc and 'id' in max_doc else 1
            db['marketing_coupon'].insert_one(data)
            data['_id'] = str(data['_id'])
            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            data = request.data.copy()
            pk = kwargs.get('pk')
            if 'id' in data: del data['id']
            if '_id' in data: del data['_id']
            from bson import ObjectId
            query = {'_id': ObjectId(pk)} if len(str(pk)) == 24 else {'id': int(pk)}
            db['marketing_coupon'].update_one(query, {'$set': data})
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            pk = kwargs.get('pk')
            from bson import ObjectId
            query = {'_id': ObjectId(pk)} if len(str(pk)) == 24 else {'id': int(pk)}
            db['marketing_coupon'].delete_one(query)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AdViewSet(viewsets.ModelViewSet):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        results, err = _mongo_list('marketing_ad')
        return Response({'count': len(results), 'results': results, **(({'error': err}) if err else {})})

    def create(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            data = request.data.copy()
            
            # Generate ID
            max_doc = db['marketing_ad'].find_one(sort=[("id", -1)])
            new_id = (max_doc['id'] + 1) if max_doc and 'id' in max_doc else 1
            data['id'] = new_id
            
            from datetime import datetime
            data['created_at'] = datetime.now()
            
            db['marketing_ad'].insert_one(data)
            data['_id'] = str(data['_id'])
            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            data = request.data.copy()
            pk = kwargs.get('pk')
            
            if 'id' in data: del data['id']
            if '_id' in data: del data['_id']
            
            from bson import ObjectId
            # Try finding by ObjectId or by custom 'id'
            query = {'_id': ObjectId(pk)} if len(str(pk)) == 24 else {'id': int(pk)}
            
            db['marketing_ad'].update_one(query, {'$set': data})
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            db = get_mongo_db()
            pk = kwargs.get('pk')
            from bson import ObjectId
            query = {'_id': ObjectId(pk)} if len(str(pk)) == 24 else {'id': int(pk)}
            db['marketing_ad'].delete_one(query)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
