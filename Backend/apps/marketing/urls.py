from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, PromotionViewSet, CouponViewSet, AdViewSet

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet)
router.register(r'promotions', PromotionViewSet)
router.register(r'coupons', CouponViewSet)
router.register(r'ads', AdViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
