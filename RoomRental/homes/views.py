from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Accommodation, User
from . import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


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


class AccommdationViewSet(viewsets.ViewSet, generics.GenericAPIView):
    queryset = Accommodation.objects.filter(status=True)
    serializer_class = serializers.AccommodationSerializer
    permission_classes = [permissions.IsAuthenticated]