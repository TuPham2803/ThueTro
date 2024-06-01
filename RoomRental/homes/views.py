from datetime import datetime

from django.db.models import Count
from django.db.models.functions import ExtractMonth, ExtractYear, ExtractQuarter
from rest_framework import viewsets, permissions, status, generics, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import PostAccommodation, User, PostRequest, CommentAccommodation, CommentRequest, LikeAccommodation, \
    LikeRequest, AccommodationImage, PendingStatus
from . import serializers, perms
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .perms import RestrictTo
import cloudinary
from .sendmail import send_mail
from threading import Thread
from .pagination import SmallPagination


class PostAccommodationViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = PostAccommodation.objects.filter(active=True)
    serializer_class = serializers.PostAccommodationSerializer
    pagination_class = SmallPagination

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
        
    @action(methods=['POST'], url_path='review', detail=True)
    def review(self, request, pk):
        post = self.get_object()
        data = request.data
        review = data.get('review')
        if review not in ['Approved', 'Failed']:
            return Response({'error': 'Reivew must is Approved or Failed'}, status=status.HTTP_400_BAD_REQUEST)
        post.pending_status = review=='Approved' and PendingStatus.APPROVED or PendingStatus.FAILED
        post.save()
        if review == 'Approved':
            Thread(target=send_mail, args=(post,)).start()
        return Response(serializers.PostAccommodationSerializer(post).data, status=status.HTTP_200_OK)
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
        # Tạo bài đăng mới từ dữ liệu yêu cầu
        post_serializer = self.get_serializer(data=request.data)
        if not post_serializer.is_valid():
            return Response(post_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra số lượng hình ảnh tải lên
        images = request.FILES.getlist('images')
        if len(images) < 3:
            return Response({'error': 'At least three images are required'}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_image_urls = []
        for image_file in images:
            try:
                upload_result = cloudinary.uploader.upload(image_file)
                uploaded_image_urls.append(upload_result['secure_url'])
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Chỉ khi tất cả hình ảnh được tải lên thành công, lưu bài đăng và ảnh vào cơ sở dữ liệu
        post = post_serializer.save(owner=request.user, user_post=request.user)
        for url in uploaded_image_urls:
            AccommodationImage.objects.create(image=url, post_accommodation=post)

        # Chuẩn bị dữ liệu phản hồi
        response_data = {
            'post': post_serializer.data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

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


class UserViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer

    # permission_classes = [permissions.IsAuthenticated, IsTenantAndFollowLandlord]

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            user_id = self.request.query_params.get('id')
            if user_id:
                queryset = queryset.filter(id__icontains=user_id)

            return queryset

    def get_permissions(self):
        if self.action == 'get_current_user':
            return [permissions.IsAuthenticated()]
        if self.action == 'follows' and self.request.method == 'POST':
            return [perms.IsTenantAndFollowLandlord()]
        return [permissions.AllowAny()]

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

    @action(methods=['get'], detail=False, url_path='statistics')
    def user_statistics(self, request):
        serializer = serializers.UserStatisticSerializer(
            data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        period = serializer.validated_data['period']
        period_value = serializer.validated_data['period_value']

        filters = {}
        try:
            if period == 'month':
                date = datetime.strptime(period_value, '%Y-%m')
                filters['date_joined__year'] = date.year
                filters['date_joined__month'] = date.month
            elif period == 'year':
                year = int(period_value)
                filters['date_joined__year'] = year
            elif period == 'quarter':
                quarter, year = period_value.split('-')
                year = int(year)
                quarter_months = {
                    'Q1': (1, 3),
                    'Q2': (4, 6),
                    'Q3': (7, 9),
                    'Q4': (10, 12)
                }
                if quarter in quarter_months:
                    start_month, end_month = quarter_months[quarter]
                    filters['date_joined__year'] = year
                    filters['date_joined__month__gte'] = start_month
                    filters['date_joined__month__lte'] = end_month
                else:
                    return Response({'error': 'Invalid quarter. Use Q1, Q2, Q3, or Q4.'},
                                    status=status.HTTP_400_BAD_REQUEST)
            elif period == 'time_period':
                start_date, end_date = period_value.split('_to_')
                filters['date_joined__date__gte'] = start_date
                filters['date_joined__date__lte'] = end_date
        except ValueError:
            return Response({'error': f'Invalid period_value for {period}. Use the correct format.'},
                            status=status.HTTP_400_BAD_REQUEST)

        user_counts = {}
        for user_type in ['landlord', 'tenant']:
            user_counts[user_type] = User.objects.filter(
                user_type=user_type, **filters).count()

        return Response({
            'user_type_counts': user_counts,
            'period': period,
            'period_value': period_value
        }, status=status.HTTP_200_OK)


class CommentAccommodationViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = CommentAccommodation.objects.all()
    serializer_class = serializers.CommentAccommodationSerializer
    permission_classes = [perms.CommentOwner]


class CommentRequestViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = CommentRequest.objects.all()
    serializer_class = serializers.CommentRequestSerializer
    permission_classes = [perms.CommentOwner]
