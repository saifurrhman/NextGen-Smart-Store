from rest_framework.renderers import JSONRenderer
from rest_framework.utils.encoders import JSONEncoder
from bson import ObjectId
from bson.decimal128 import Decimal128

class MongoJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, Decimal128):
            return float(obj.to_decimal())
        return super().default(obj)

class MongoJSONRenderer(JSONRenderer):
    encoder_class = MongoJSONEncoder
