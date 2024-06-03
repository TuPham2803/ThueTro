from rest_framework import viewsets, permissions, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from homes.models import User
from homes import serializers, perms
from datetime import datetime

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