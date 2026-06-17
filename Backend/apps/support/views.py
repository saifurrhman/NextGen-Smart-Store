from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status as http_status
from .models import Ticket, KnowledgeBaseArticle
from .serializers import TicketSerializer, KnowledgeBaseArticleSerializer
from core.utils import get_mongo_db
from bson import ObjectId
from datetime import datetime


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['status', 'priority']
    search_fields = ['subject', 'user__email']


class KnowledgeBaseArticleViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeBaseArticle.objects.all().order_by('-created_at')
    serializer_class = KnowledgeBaseArticleSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['category']
    search_fields = ['title', 'content']


def _get_col():
    return get_mongo_db()['support_chatsession']


def _heal_collection(col):
    """Fix any docs with null/missing id and drop any bad sparse index."""
    try:
        # Drop the unique index on 'id' if it exists (it causes E11000 on null id docs)
        existing_indexes = col.index_information()
        for idx_name, idx_info in existing_indexes.items():
            key_fields = [k[0] for k in idx_info.get('key', [])]
            if 'id' in key_fields and idx_name != '_id_':
                try:
                    col.drop_index(idx_name)
                    print(f"[ChatSession] Dropped index: {idx_name}")
                except Exception as ie:
                    print(f"[ChatSession] Could not drop index {idx_name}: {ie}")

        # Assign id = _id for any document missing 'id'
        fixed = 0
        for doc in col.find({'$or': [{'id': None}, {'id': {'$exists': False}}]}):
            col.update_one({'_id': doc['_id']}, {'$set': {'id': doc['_id']}})
            fixed += 1
        if fixed:
            print(f"[ChatSession] Fixed {fixed} null-id documents.")
    except Exception as e:
        print(f"[ChatSession] Heal error: {e}")


def _serialize_session(doc):
    """Convert a raw MongoDB chat session document to a JSON-safe dict."""
    def _s(v):
        return str(v) if v is not None else None

    def _dt(v):
        if v is None:
            return None
        return v.isoformat() if hasattr(v, 'isoformat') else str(v)

    return {
        'id': _s(doc.get('_id')),
        'customer_name': doc.get('customer_name', '') or '',
        'topic': doc.get('topic', '') or '',
        'status': doc.get('status', 'waiting'),
        'duration_seconds': doc.get('duration_seconds', 0) or 0,
        'created_at': _dt(doc.get('created_at')),
        'updated_at': _dt(doc.get('updated_at')),
        'user': _s(doc.get('user_id')),
        'agent': _s(doc.get('agent_id')),
        'user_details': None,
        'agent_details': None,
    }


def _seed_if_empty(col):
    if col.count_documents({}) > 0:
        return
    try:
        db = get_mongo_db()
        customers = list(db['users_user'].find({'role': 'CUSTOMER'}).limit(2))
        vendors = list(db['users_user'].find({'role': 'VENDOR'}).limit(1))
        delivery = list(db['users_user'].find({'role': 'DELIVERY'}).limit(1))
        admins = list(db['users_user'].find(
            {'role': {'$in': ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN']}}).limit(1))
        admin_id = admins[0]['_id'] if admins else None

        samples = []
        if customers:
            oid = ObjectId()
            name = (customers[0].get('first_name', '') + ' ' + customers[0].get('last_name', '')).strip() or 'Customer'
            samples.append({'_id': oid, 'id': oid, 'customer_name': name,
                            'user_id': customers[0]['_id'], 'topic': 'Order Status Inquiry',
                            'agent_id': admin_id, 'status': 'active', 'duration_seconds': 180,
                            'created_at': datetime.now(), 'updated_at': datetime.now()})
        if vendors:
            oid = ObjectId()
            samples.append({'_id': oid, 'id': oid, 'customer_name': '',
                            'user_id': vendors[0]['_id'], 'topic': 'Payout Request Query',
                            'agent_id': admin_id, 'status': 'waiting', 'duration_seconds': 45,
                            'created_at': datetime.now(), 'updated_at': datetime.now()})
        if delivery:
            oid = ObjectId()
            samples.append({'_id': oid, 'id': oid, 'customer_name': '',
                            'user_id': delivery[0]['_id'], 'topic': 'Route Assignment Help',
                            'agent_id': admin_id, 'status': 'active', 'duration_seconds': 320,
                            'created_at': datetime.now(), 'updated_at': datetime.now()})
        oid = ObjectId()
        samples.append({'_id': oid, 'id': oid, 'customer_name': 'Ayesha Khan (Guest)',
                        'user_id': None, 'topic': 'Product Refund Policy',
                        'agent_id': admin_id, 'status': 'active', 'duration_seconds': 120,
                        'created_at': datetime.now(), 'updated_at': datetime.now()})
        if samples:
            col.insert_many(samples)
            print(f"[ChatSession] Seeded {len(samples)} sample sessions.")
    except Exception as e:
        print(f"[ChatSession] Seed error: {e}")


class ChatSessionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        try:
            col = _get_col()
            _heal_collection(col)
            _seed_if_empty(col)

            query = {}
            status_filter = request.query_params.get('status', '')
            if status_filter:
                query['status'] = status_filter

            search = request.query_params.get('search', '').strip()
            if search:
                query['$or'] = [
                    {'customer_name': {'$regex': search, '$options': 'i'}},
                    {'topic': {'$regex': search, '$options': 'i'}},
                ]

            docs = list(col.find(query).sort('created_at', -1))
            results = [_serialize_session(d) for d in docs]
            return Response({'count': len(results), 'results': results})
        except Exception as e:
            print(f"[ChatSession] list error: {e}")
            return Response({'count': 0, 'results': [], 'error': str(e)})

    def create(self, request, *args, **kwargs):
        try:
            col = _get_col()
            _heal_collection(col)  # Always heal before inserting

            data = request.data
            topic = str(data.get('topic') or '').strip()
            if not topic:
                return Response({'topic': ['Topic is required.']},
                                status=http_status.HTTP_400_BAD_REQUEST)

            # Resolve user
            user_id = None
            raw_user = data.get('user') or data.get('user_id')
            if raw_user and str(raw_user).strip():
                try:
                    from apps.users.models import User
                    user_id = User.objects.get(pk=raw_user).pk
                except Exception:
                    pass

            # Resolve agent
            agent_id = None
            raw_agent = data.get('agent') or data.get('agent_id')
            if raw_agent and str(raw_agent).strip():
                try:
                    from apps.users.models import User
                    agent_id = User.objects.get(pk=raw_agent).pk
                except Exception:
                    pass

            status_val = str(data.get('status') or 'waiting')
            if status_val not in ('waiting', 'active', 'closed'):
                status_val = 'waiting'

            try:
                dur = int(data.get('duration_seconds') or 0)
            except (ValueError, TypeError):
                dur = 0

            new_id = ObjectId()
            doc = {
                '_id': new_id,
                'id': new_id,
                'customer_name': str(data.get('customer_name') or '').strip(),
                'user_id': user_id,
                'topic': topic,
                'agent_id': agent_id,
                'status': status_val,
                'duration_seconds': dur,
                'created_at': datetime.now(),
                'updated_at': datetime.now(),
            }
            col.insert_one(doc)
            print(f"[ChatSession] Created session: {new_id} topic={topic}")
            return Response(_serialize_session(doc), status=http_status.HTTP_201_CREATED)

        except Exception as e:
            print(f"[ChatSession] create error: {e}")
            import traceback
            traceback.print_exc()
            return Response({'detail': str(e)}, status=http_status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None, *args, **kwargs):
        try:
            col = _get_col()
            doc = col.find_one({'_id': ObjectId(pk)})
            if not doc:
                return Response({'detail': 'Not found.'}, status=http_status.HTTP_404_NOT_FOUND)
            return Response(_serialize_session(doc))
        except Exception as e:
            return Response({'detail': str(e)}, status=http_status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None, *args, **kwargs):
        return self.update(request, pk, *args, **kwargs)

    def update(self, request, pk=None, *args, **kwargs):
        try:
            col = _get_col()
            data = request.data
            update_fields = {'updated_at': datetime.now()}

            if data.get('topic'):
                update_fields['topic'] = str(data['topic']).strip()
            if 'customer_name' in data:
                update_fields['customer_name'] = str(data.get('customer_name') or '').strip()
            if data.get('status') in ('waiting', 'active', 'closed'):
                update_fields['status'] = data['status']
            if 'duration_seconds' in data:
                try:
                    update_fields['duration_seconds'] = int(data['duration_seconds'] or 0)
                except Exception:
                    pass

            result = col.find_one_and_update(
                {'_id': ObjectId(pk)},
                {'$set': update_fields},
                return_document=True
            )
            if not result:
                return Response({'detail': 'Not found.'}, status=http_status.HTTP_404_NOT_FOUND)
            return Response(_serialize_session(result))
        except Exception as e:
            return Response({'detail': str(e)}, status=http_status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None, *args, **kwargs):
        try:
            col = _get_col()
            result = col.delete_one({'_id': ObjectId(pk)})
            if result.deleted_count == 0:
                return Response({'detail': 'Not found.'}, status=http_status.HTTP_404_NOT_FOUND)
            return Response(status=http_status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'detail': str(e)}, status=http_status.HTTP_400_BAD_REQUEST)


# ──────────────────────────────────────────────────────────
#  Chat Messages  (WhatsApp-style real-time chat)
# ──────────────────────────────────────────────────────────

def _msg_col():
    return get_mongo_db()['support_chatmessage']


def _serialize_msg(doc):
    def _s(v): return str(v) if v is not None else None
    def _dt(v): return v.isoformat() if hasattr(v, 'isoformat') else str(v) if v else None
    return {
        'id': _s(doc.get('_id')),
        'session_id': _s(doc.get('session_id')),
        'sender_type': doc.get('sender_type', 'admin'),   # 'admin' | 'customer' | 'system'
        'sender_name': doc.get('sender_name', ''),
        'message': doc.get('message', ''),
        'created_at': _dt(doc.get('created_at')),
        'is_read': doc.get('is_read', False),
    }


class ChatMessageViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        """GET /chat-messages/?session_id=<id>&after=<iso_datetime>"""
        try:
            session_id = request.query_params.get('session_id', '')
            if not session_id:
                return Response({'count': 0, 'results': []})

            col = _msg_col()
            query = {'session_id': session_id}

            after = request.query_params.get('after', '')
            if after:
                try:
                    from dateutil import parser as dtparser
                    after_dt = dtparser.parse(after)
                    query['created_at'] = {'$gt': after_dt}
                except Exception:
                    pass

            docs = list(col.find(query).sort('created_at', 1))
            results = [_serialize_msg(d) for d in docs]
            return Response({'count': len(results), 'results': results})
        except Exception as e:
            print(f"[ChatMessage] list error: {e}")
            return Response({'count': 0, 'results': []})

    def create(self, request, *args, **kwargs):
        """POST /chat-messages/  body: {session_id, sender_type, sender_name, message}"""
        try:
            data = request.data
            session_id = str(data.get('session_id') or '').strip()
            message = str(data.get('message') or '').strip()

            if not session_id or not message:
                return Response({'detail': 'session_id and message are required.'},
                                status=http_status.HTTP_400_BAD_REQUEST)

            sender_type = str(data.get('sender_type') or 'admin')
            if sender_type not in ('admin', 'customer', 'system'):
                sender_type = 'admin'

            col = _msg_col()
            new_id = ObjectId()
            doc = {
                '_id': new_id,
                'session_id': session_id,
                'sender_type': sender_type,
                'sender_name': str(data.get('sender_name') or '').strip() or sender_type.capitalize(),
                'message': message,
                'created_at': datetime.now(),
                'is_read': False,
            }
            col.insert_one(doc)

            # Update session's updated_at
            try:
                _get_col().update_one(
                    {'_id': ObjectId(session_id)},
                    {'$set': {'updated_at': datetime.now()}}
                )
            except Exception:
                pass

            return Response(_serialize_msg(doc), status=http_status.HTTP_201_CREATED)
        except Exception as e:
            print(f"[ChatMessage] create error: {e}")
            return Response({'detail': str(e)}, status=http_status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk=None, *args, **kwargs):
        try:
            result = _msg_col().delete_one({'_id': ObjectId(pk)})
            if result.deleted_count == 0:
                return Response({'detail': 'Not found.'}, status=http_status.HTTP_404_NOT_FOUND)
            return Response(status=http_status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'detail': str(e)}, status=http_status.HTTP_400_BAD_REQUEST)
