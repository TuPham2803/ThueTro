from rest_framework.serializers import ModelSerializer, ValidationError
from .models import PostAccommodation, User, PostRequest, CommentAccommodation, Follow, AccommodationImage
from . import perms
import cloudinary
from cloudinary.models import CloudinaryField


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'user_type', 'image', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image'] = instance.image.url

        return rep


class PostRequestSerializer(ModelSerializer):
    class Meta:
        model = PostRequest
        fields = [
            'id',
            'area',
            'description',
            'user_post',
            'created_at',
            'updated_at',
            'active',
        ]
        read_only_fields = ['created_at', 'updated_at']


class AccomodationImageSerializer(ModelSerializer):
    class Meta:
        model = AccommodationImage
        fields = ['image']


class PostAccommodationSerializer(ModelSerializer):
    images = AccomodationImageSerializer(many=True, read_only=True)

    class Meta:
        model = PostAccommodation
        fields = [
            'id',
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
        read_only_fields = ['created_at', 'updated_at', 'active', 'pending_status']

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
