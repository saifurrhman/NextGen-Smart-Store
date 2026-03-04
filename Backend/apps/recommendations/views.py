"""
Recommendations views — AI product recommendations using raw PyMongo.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from core.utils import get_mongo_db


class RecommendationListView(APIView):
    """
    GET /api/v1/recommendations/   — list recommendation rules/data.
    GET /api/v1/recommendations/?user_email=x — get recommendations for a user.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            db = get_mongo_db()
            col = db['recommendations_recommendation']

            query = {}
            user_email = request.query_params.get('user_email', '')
            if user_email:
                query['user_email'] = user_email

            product_id = request.query_params.get('product_id', '')
            if product_id:
                query['product_id'] = product_id

            docs = list(col.find(query).sort('_id', -1).limit(50))
            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)

            return Response({'count': len(results), 'results': results})
        except Exception as e:
            return Response({'count': 0, 'results': [], 'error': str(e)})
