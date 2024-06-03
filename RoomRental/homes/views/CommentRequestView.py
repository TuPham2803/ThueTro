from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from homes.models import CommentRequest
from homes import serializers, perms
from homes.perms import RestrictTo

class CommentRequestViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = CommentRequest.objects.all()
    serializer_class = serializers.CommentRequestSerializer
    permission_classes = [perms.CommentOwner]