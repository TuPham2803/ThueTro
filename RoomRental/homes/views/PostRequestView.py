from rest_framework import viewsets, permissions, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from homes.models import PostRequest, LikeRequest
from homes import serializers, perms
from homes.perms import RestrictTo
import cloudinary

class PostRequestViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = PostRequest.objects.filter(active=True)
    serializer_class = serializers.PostRequestSerializer

    # def perform_create(self, serializer):
    #     serializer.save(user_post=self.request.user)
    def get_permissions(self):
        if self.action == 'comments' and self.request.POST:
            return [permissions.IsAuthenticated()]
        if self.action in ['like']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['GET', 'POST'], detail=True, url_path='comments')
    def comments(self, request, pk=None):
        if request.method == 'GET':
            comments = self.get_object().commentrequest_set.select_related('user').all()
            return Response(serializers.CommentRequestSerializer(comments, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            c = self.get_object().commentrequest_set.create(content=request.data.get('content'),
                                                            user=request.user)
            return Response(serializers.CommentRequestSerializer(c).data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user_post=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user_post=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.serializer_class(
            instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['post'], url_path='like', detail=True)
    def like(self, request, pk):
        li, created = LikeRequest.objects.get_or_create(post_request=self.get_object(),
                                                        user=request.user)

        if not created:
            li.active = not li.active
            li.save()

        return Response(serializers.LikeRequestSerializer(li).data,
                        status=status.HTTP_201_CREATED)