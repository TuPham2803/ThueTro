from rest_framework import viewsets, permissions, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import PostAccommodation, User, PostRequest
from . import serializers, perms
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class PostAccommodationViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = PostAccommodation.objects.all()
    serializer_class = serializers.PostAccommodationSerializer

    def get_permissions(self):
        if self.action == 'comments' and self.request.POST:
            return [permissions.IsAuthenticated()]
        if self.action in ['like']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['GET', 'POST'], detail=True, url_path='comments')
    def comments(self, request, pk=None):
        if request.method == 'GET':
            comments = self.get_object().commentaccommodation_set.select_related('user').all()
            return Response(serializers.CommentAccommodationSerializer(comments, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            c = self.get_object().commentaccommodation_set.create(content=request.data.get('content'),
                                                                  user=request.user)
            return Response(serializers.CommentAccommodationSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['POST'], detail=True, url_path='like')
    def like(self, request, pk=None):
        l, created = self.get_object().likeaccommodation_set.get_or_create(user=request.user)
        if created:
            status_code = status.HTTP_201_CREATED
        else:
            status_code = status.HTTP_200_OK
        return Response(serializers.LikeAccommodationSerializer(l).data, status=status_code)


class PostRequestViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = PostRequest.objects.all()
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

    @action(methods=['POST'], detail=True, url_path='like')
    def like(self, request, pk=None):
        l, created = self.get_object().likerequest_set.get_or_create(user=request.user)
        if created:
            status_code = status.HTTP_201_CREATED
        else:
            status_code = status.HTTP_200_OK
        return Response(serializers.LikeRequestSerializer(l).data, status=status_code)


class UserViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer

    @action(methods=['post'], detail=False)
    def login(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Đăng nhập thành công, tạo token
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            # Xác thực không thành công
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=['post'], url_path='create', detail=False)
    def create_user(self, request):
        data = request.data

        # Tạo user mới
        user = User.objects.create_user(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password')
        )

        user.set_password(data.get('password'))
        user.save()

        # Trả về thông tin user đã tạo
        u = serializers.UserSerializer(user)
        return Response(u.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='forgot', detail=False)
    def forgot_password(self, request):
        users = self.get_object().user_set.filter(active=True)
        data = request.data

        email = data.get('email')

        if email:
            u = users.filter(email__iexact=email)
            if u:
                return Response({'result': 'Success'}, status=status.HTTP_200_OK)
            else:
                return Response({'result': 'Fail'}, status=status.HTTP_404_NOT_FOUND)

        # gui mail o day -> gui ma link reset lai mat khau

    # lay thong tin user hien tai
    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()
        return Response(serializers.UserSerializer(user).data)

# class PostAccommdationViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
#     queryset = PostAccommodation.objects.filter(status=True)
#     serializer_class = serializers.AccommodationSerializer


# Delete comment
# class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
#     queryset = Comment.objects.all()
#     serializer_class = serializers.CommentSerializer
#     permission_classes = [perms.CommentOwner]
