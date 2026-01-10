from rest_framework import generics, permissions
from .models import BlogPost, ContactMessage
from .serializers import BlogPostSerializer, ContactMessageSerializer

class BlogPostListView(generics.ListAPIView):
    queryset = BlogPost.objects.filter(is_published=True).order_by('-created_at')
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]

class BlogPostDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.filter(is_published=True)
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
