from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from homes.models import CommentAccommodation
from homes import serializers, perms
from homes.perms import RestrictTo

class CommentAccommodationViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = CommentAccommodation.objects.all()
    serializer_class = serializers.CommentAccommodationSerializer
    permission_classes = [perms.CommentOwner]