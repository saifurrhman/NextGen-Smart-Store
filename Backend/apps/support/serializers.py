from rest_framework import serializers
from .models import Ticket, KnowledgeBaseArticle, ChatSession
from apps.users.serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class RobustUserRelatedField(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, data):
        if not data:
            return None
        
        # If the input is an email string, lookup directly by email
        if isinstance(data, str) and '@' in data:
            try:
                return User.objects.get(email=data)
            except User.DoesNotExist:
                pass
                
        try:
            return User.objects.get(pk=data)
        except Exception:
            try:
                from bson import ObjectId
                return User.objects.get(pk=ObjectId(data))
            except Exception:
                try:
                    return User.objects.get(pk=int(str(data)))
                except Exception:
                    try:
                        from core.utils import get_mongo_db
                        db = get_mongo_db()
                        
                        from bson import ObjectId
                        query_ids = [data]
                        try:
                            query_ids.append(ObjectId(data))
                        except Exception:
                            pass
                        try:
                            query_ids.append(int(data))
                        except Exception:
                            pass
                            
                        doc = db['users_user'].find_one({
                            '$or': [
                                {'_id': {'$in': query_ids}},
                                {'id': {'$in': query_ids}},
                                {'id': data},
                                {'id': str(data)},
                                {'email': data}
                            ]
                        })
                        if doc:
                            return User.objects.get(pk=doc['_id'])
                    except Exception:
                        pass
                        
                    self.fail('does_not_exist', pk_value=data)

class TicketSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)
    user = RobustUserRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    assigned_to = RobustUserRelatedField(queryset=User.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Ticket
        fields = '__all__'

class KnowledgeBaseArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeBaseArticle
        fields = '__all__'

class ChatSessionSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    agent_details = UserSerializer(source='agent', read_only=True)
    user = RobustUserRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    agent = RobustUserRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    customer_name = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = ChatSession
        fields = '__all__'
