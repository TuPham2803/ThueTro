from rest_framework import viewsets, permissions, status, generics, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import PostAccommodation, User, PostRequest, CommentAccommodation, CommentRequest, LikeAccommodation, \
    LikeRequest, AccommodationImage
from . import serializers, perms
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .perms import RestrictTo
import cloudinary
from .perms import IsTenantAndFollowLandlord


class PostAccommodationViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = PostAccommodation.objects.filter(active=True)
    serializer_class = serializers.PostAccommodationSerializer

    def get_permissions(self):
        if self.action == 'comments' and self.request.POST:
            return [permissions.IsAuthenticated()]
        if self.action in ['like']:
            return [permissions.IsAuthenticated()]
        if self.action == 'create' and self.request.method == 'POST':
            return [permissions.IsAuthenticated(), RestrictTo(['landlord'])]
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

    @action(methods=['post'], url_path='like', detail=True)
    def like(self, request, pk):
        li, created = LikeAccommodation.objects.get_or_create(post_accommodation=self.get_object(),
                                                              user=request.user)

        if not created:
            li.active = not li.active
            li.save()

        return Response(serializers.LikeAccommodationSerializer(li).data,
                        status=status.HTTP_201_CREATED)

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            district = self.request.query_params.get('district')
            if district:
                queryset = queryset.filter(district__icontains=district)

            city = self.request.query_params.get('city')
            if city:
                queryset = queryset.filter(city__icontains=city)

            max_people = self.request.query_params.get('max_people')
            if max_people:
                queryset = queryset.filter(max_people__gte=max_people)

            current_people = self.request.query_params.get('current_people')
            if current_people:
                queryset = queryset.filter(current_people__lte=current_people)

            min_price = self.request.query_params.get('min_price')
            if min_price:
                queryset = queryset.filter(price__gte=min_price)

            max_price = self.request.query_params.get('max_price')
            if max_price:
                queryset = queryset.filter(price__lte=max_price)

            pending_status = self.request.query_params.get('pending_status')
            if pending_status:
                queryset = queryset.filter(pending_status=pending_status)

        return queryset

    def create(self, request, *args, **kwargs):
        # Tạo bài đăng mới
        post_serializer = self.get_serializer(data=request.data)
        post_serializer.is_valid(raise_exception=True)
        post = post_serializer.save()

        # Tải các hình ảnh lên CDN và tạo dữ liệu trong cơ sở dữ liệu cho chúng
        images = request.FILES.getlist('images')

        if len(images) < 3:
            return Response({'error': 'At least three images are required'}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_image_urls = []
        for image_file in images:
            upload_result = cloudinary.uploader.upload(image_file)
            uploaded_image_urls.append(upload_result['secure_url'])
            AccommodationImage.objects.create(image=upload_result['secure_url'], post_accommodation=post)

        response_data = {
            'post': post_serializer.data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
        serializer = self.serializer_class(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_create(self, serializer):
        serializer.save(user_post=self.request.user)

    @action(methods=['post'], url_path='like', detail=True)
    def like(self, request, pk):
        li, created = LikeRequest.objects.get_or_create(post_request=self.get_object(),
                                                        user=request.user)

        if not created:
            li.active = not li.active
            li.save()

        return Response(serializers.LikeRequestSerializer(li).data,
                        status=status.HTTP_201_CREATED)


class UserViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer

    # permission_classes = [permissions.IsAuthenticated, IsTenantAndFollowLandlord]

    def get_permissions(self):
        if self.action == 'get_current_user':
            return [permissions.IsAuthenticated()]
        if self.action == 'follows' and self.request.method == 'POST':
            return [IsTenantAndFollowLandlord()]
        return [permissions.AllowAny()]

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

    @action(methods=['post'], detail=False, url_path='create')
    def create_user(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Tạo user mới
        user = serializer.save()

        # Trả về thông tin user đã tạo
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()
        return Response(serializers.UserSerializer(user).data)

    @action(methods=['GET', 'POST'], detail=True, url_path='follows')
    def follows(self, request, pk=None):
        if request.method == 'GET':
            follows = self.get_object().followers.select_related('follower').all()
            return Response(serializers.FollowSerializer(follows, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            fo, created = self.get_object().followers.get_or_create(follower=request.user)
            if not created:
                fo.active = not fo.active
                fo.save()
            return Response(serializers.FollowSerializer(fo).data, status=status.HTTP_201_CREATED)


class CommentAccommodationViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = CommentAccommodation.objects.all()
    serializer_class = serializers.CommentAccommodationSerializer
    permission_classes = [perms.CommentOwner]


class CommentRequestViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = CommentRequest.objects.all()
    serializer_class = serializers.CommentRequestSerializer
    permission_classes = [perms.CommentOwner]
