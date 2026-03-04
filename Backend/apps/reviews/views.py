"""
Reviews views — list product reviews from MongoDB.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from core.utils import get_mongo_db


class ReviewListView(APIView):
    """
    GET /api/v1/reviews/   — list all reviews (admin) or by product.
    POST /api/v1/reviews/  — create a new review.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            db = get_mongo_db()
            col = db['reviews_review']

            query = {}
            product_id = request.query_params.get('product', '')
            if product_id:
                query['product_id'] = product_id

            rating = request.query_params.get('rating', '')
            if rating:
                try:
                    query['rating'] = int(rating)
                except ValueError:
                    pass

            docs = list(col.find(query).sort('_id', -1).limit(100))
            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)

            return Response({'count': len(results), 'results': results})
        except Exception as e:
            return Response({'count': 0, 'results': [], 'error': str(e)})

    def post(self, request):
        try:
            db = get_mongo_db()
            col = db['reviews_review']
            data = {
                'product_id': request.data.get('product_id', ''),
                'user_email': request.data.get('user_email', ''),
                'rating': int(request.data.get('rating', 5)),
                'comment': request.data.get('comment', ''),
                'is_approved': False,
            }
            if not data['product_id'] or not data['user_email']:
                return Response({'error': 'product_id and user_email are required.'}, status=status.HTTP_400_BAD_REQUEST)

            result = col.insert_one(data)
            data['id'] = str(result.inserted_id)
            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetailView(APIView):
    """
    DELETE /api/v1/reviews/<id>/  — admin delete a review.
    PATCH  /api/v1/reviews/<id>/  — admin approve/update a review.
    """
    permission_classes = [permissions.AllowAny]

    def delete(self, request, pk=None):
        try:
            from bson import ObjectId
            db = get_mongo_db()
            db['reviews_review'].delete_one({'_id': ObjectId(pk)})
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        try:
            from bson import ObjectId
            db = get_mongo_db()
            update_data = {}
            if 'is_approved' in request.data:
                update_data['is_approved'] = bool(request.data['is_approved'])
            if 'comment' in request.data:
                update_data['comment'] = request.data['comment']
            db['reviews_review'].update_one({'_id': ObjectId(pk)}, {'$set': update_data})
            return Response({'message': 'Review updated.'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
