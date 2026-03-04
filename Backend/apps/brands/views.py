"""
Brands views — simple read-only list using raw PyMongo.
Brands are stored/managed via product attributes in this system.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from core.utils import get_mongo_db


class BrandListView(APIView):
    """
    GET /api/v1/brands/
    Returns all brands from the attributes collection (stored under 'brand' type).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            db = get_mongo_db()

            # Try dedicated brands collection first
            brands_col = db['brands_brand']
            count = brands_col.count_documents({})

            if count == 0:
                # Fallback: pull brand-type attributes from the attributes app
                attrs_col = db['attributes_attribute']
                docs = list(attrs_col.find({'type': 'brand'}).sort('_id', -1).limit(200))
            else:
                docs = list(brands_col.find({}).sort('_id', -1).limit(200))

            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)

            return Response({'count': len(results), 'results': results})
        except Exception as e:
            return Response({'count': 0, 'results': [], 'error': str(e)})
