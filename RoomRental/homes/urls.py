from django.urls import path, include
from . import views
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'post_accommodations', views.PostAccommodationViewSet, basename='post_accommodation')
router.register(r'post_requests', views.PostRequestViewSet, basename='post_request')
router.register(r'user', views.UserViewSet, basename='user')
router.register(r'comments', views.CommentAccommodationViewSet, basename='comments')
router.register(r'follows', views.FollowViewSet, basename='follows')


urlpatterns = [
    path('', include(router.urls)),
]
