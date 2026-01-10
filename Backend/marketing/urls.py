from django.urls import path
from .views import BlogPostListView, BlogPostDetailView, ContactMessageCreateView

urlpatterns = [
    path('blog/', BlogPostListView.as_view(), name='blog-list'),
    path('blog/<slug:slug>/', BlogPostDetailView.as_view(), name='blog-detail'),
    path('contact/', ContactMessageCreateView.as_view(), name='contact-create'),
]
