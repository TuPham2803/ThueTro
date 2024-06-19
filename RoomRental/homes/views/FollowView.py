from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from homes.models import Follow
from homes import serializers, perms

class FollowViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Follow.objects.all()
    serializer_class = serializers.FollowSerializer
    
    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            follower_id = self.request.query_params.get('follower_id')
            owner_id = self.request.query_params.get('owner_id')

            if follower_id and owner_id:
                queryset = queryset.filter(follower_id__exact=follower_id, owner_id__exact=owner_id)

        return queryset