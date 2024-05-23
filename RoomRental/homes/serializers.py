from rest_framework.serializers import ModelSerializer, ValidationError, CharField
from .models import PostAccommodation, User, PostRequest, CommentAccommodation, Follow, AccommodationImage
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from . import perms
import cloudinary
from cloudinary.models import CloudinaryField


class UserSerializer(ModelSerializer):
    confirmed_password = CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'user_type', 'image', 'first_name', 'last_name',
                  'confirmed_password']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'image': {'required': True},
            'user_type': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'confirmed_password': {'required': True}
        }

    def validate(self, data):
        # Kiểm tra các trường bắt buộc không nhận giá trị null
        required_fields = ['username', 'password', 'email', 'user_type', 'first_name', 'last_name',
                           'confirmed_password']
        for field in required_fields:
            if data.get(field) in [None, '']:
                raise ValidationError({field: 'This field is required and cannot be null or empty.'})

        try:
            validate_password(data.get('password'))
        except DjangoValidationError as e:
            raise ValidationError({'password': list(e.messages)})

        if data.get('password') != data.get('confirmed_password'):
            raise ValidationError({'confirmed_password': 'Password fields didn’t match.'})

        return data

    def create(self, validated_data):
        validated_data.pop('confirmed_password')
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.image:
            rep['image'] = instance.image.url

        return rep


class PostRequestSerializer(ModelSerializer):
    class Meta:
        model = PostRequest
        fields = [
            'area',
            'description',
            'user_post',
            'created_at',
            'updated_at',
            'active',
        ]
        read_only_fields = ['created_at', 'updated_at', 'user_post']
        extra_kwargs = {
            'area': {'required': True},
            'description': {'required': True},
        }

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user_post'] = user
        return super().create(validated_data)

    def validate(self, data):
        # Kiểm tra các trường bắt buộc không nhận giá trị null
        required_fields = [
            'area',
            'description',
        ]
        for field in required_fields:
            if data.get(field) in [None, '']:
                raise ValidationError({field: 'This field is required and cannot be null or empty.'})

        return data


class AccomodationImageSerializer(ModelSerializer):
    class Meta:
        model = AccommodationImage
        fields = ['image']


class PostAccommodationSerializer(ModelSerializer):
    images = AccomodationImageSerializer(many=True, read_only=True)

    class Meta:
        model = PostAccommodation
        fields = [
            'owner',
            'title',
            'city',
            'district',
            'address',
            'latitude',
            'longitude',
            'acreage',
            'price',
            'room_type',
            'max_people',
            'current_people',
            'phone_number',
            'description',
            'images',
            'user_post',
            'created_at',
            'updated_at',
            'active',
            'pending_status'
        ]
        extra_kwargs = {
            'owner': {'required': True},
            'title': {'required': True},
            'city': {'required': True},
            'district': {'required': True},
            'address': {'required': True},
            'latitude': {'required': True},
            'longitude': {'required': True},
            'acreage': {'required': True},
            'price': {'required': True},
            'room_type': {'required': True},
            'max_people': {'required': True},
            'current_people': {'required': True},
            'phone_number': {'required': True},
            'description': {'required': True},
            'images': {'required': True},
            'user_post': {'required': True},
            'created_at': {'required': True, 'read_only': True},
            'updated_at': {'required': True},
            'active': {'required': True, 'read_only': True},
            'pending_status': {'required': True, 'read_only': True},
        }
        read_only_fields = ['created_at', 'updated_at', 'active', 'pending_status']

    def validate(self, data):
        # Kiểm tra các trường bắt buộc không nhận giá trị null
        required_fields = [
            'owner', 'title', 'city', 'district', 'address', 'latitude', 'longitude', 'acreage', 'price', 'room_type',
            'max_people', 'current_people', 'phone_number', 'description', 'user_post'
        ]
        # Cần chỉnh sửa lại current_people và max_people. Lý do là tụi nó vẫn cần giá trị chứ không nhận null
        if data.get('room_type') == 'PR':
            required_fields.remove('current_people')
            required_fields.remove('max_people')
        for field in required_fields:
            if data.get(field) in [None, '']:
                raise ValidationError({field: 'This field is required and cannot be null or empty.'})

        return data

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        images_data = []
        images_queryset = instance.images.all() if hasattr(instance, 'images') and instance.images else None
        if images_queryset:
            for image in images_queryset:
                images_data.append(image.image.url)
        rep['images'] = images_data
        return rep


class AccommodationSerializer(ModelSerializer):
    class Meta:
        model = PostAccommodation
        fields = ['owner', 'title', 'address', 'contact_number', 'description']


class CommentAccommodationSerializer(ModelSerializer):
    user = UserSerializer()
    post_accommodation = PostAccommodationSerializer()

    class Meta:
        model = CommentAccommodation
        fields = ['id', 'user', 'post_accommodation', 'content', 'created_at', 'updated_at', 'active']


class CommentRequestSerializer(ModelSerializer):
    user = UserSerializer()
    post_request = PostRequestSerializer()

    class Meta:
        model = CommentAccommodation
        fields = ['id', 'user', 'post_request', 'content', 'created_at', 'updated_at', 'active']


class LikeAccommodationSerializer(ModelSerializer):
    user = UserSerializer()
    post_accommodation = PostAccommodationSerializer()

    class Meta:
        model = CommentAccommodation
        fields = ['id', 'user', 'post_accommodation', 'created_at', 'updated_at', 'active']


class LikeRequestSerializer(ModelSerializer):
    user = UserSerializer()
    post_request = PostRequestSerializer()

    class Meta:
        model = CommentAccommodation
        fields = ['id', 'user', 'post_request', 'created_at', 'updated_at', 'active']


class FollowSerializer(ModelSerializer):
    owner = UserSerializer()
    follower = UserSerializer()

    class Meta:
        model = Follow
        fields = ['id', 'owner', 'follower', 'created_at', 'updated_at', 'active']
