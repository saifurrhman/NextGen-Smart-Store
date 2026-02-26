from django.urls import path
from . import views

urlpatterns = [
    path('track_visit/', views.track_visit, name='track_visit'),
    path('traffic_stats/', views.traffic_stats, name='traffic_stats'),
]
