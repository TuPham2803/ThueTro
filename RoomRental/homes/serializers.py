from rest_framework.serializers import ModelSerializer
from .models import PostAccommodation, User, PostRequest, CommentAccommodation, Follow, AccommodationImage
from . import perms
import cloudinary


class UserSerializer(ModelSerializer):
    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data["password"])
        user.save()

        return user

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


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
            'status',
        ]
        read_only_fields = ['created_at', 'updated_at']


class PostAccommodationSerializer(ModelSerializer):
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
            'status'
        ]
        read_only_fields = ['created_at', 'updated_at']

        def create(self, validated_data):
            images_data = self.context['request'].FILES.getlist('images')
            post_accommodation = PostAccommodation.objects.create(**validated_data)

            for image_data in images_data:
                # Kiểm tra xem hình ảnh đã tồn tại trong cơ sở dữ liệu hay không
                existing_image = AccommodationImage.objects.filter(image=image_data.name).exists()

                if not existing_image:
                    # Nếu hình ảnh không tồn tại, tạo mới và lưu vào Cloudinary
                    image = cloudinary.uploader.upload(image_data)
                    AccommodationImage.objects.create(post_accommodation=post_accommodation, image=image['url'])

            return post_accommodation


class AccommodationSerializer(ModelSerializer):
    class Meta:
        model = PostAccommodation
        fields = ['owner', 'title', 'address', 'contact_number', 'description']


class CommentAccommodationSerializer(ModelSerializer):
    user = UserSerializer()
    post_accommodation = PostAccommodationSerializer()

    class Meta:
        model = CommentAccommodation
        fields = ['id', 'user', 'post_accommodation', 'content', 'created_at', 'updated_at', 'status']


class CommentRequestSerializer(ModelSerializer):
    user = UserSerializer()
    post_request = PostRequestSerializer()

    class Meta:
        model = CommentAccommodation
        fields = ['id', 'user', 'post_request', 'content', 'created_at', 'updated_at', 'status']


class LikeAccommodationSerializer(ModelSerializer):
    user = UserSerializer()
    post_accommodation = PostAccommodationSerializer()

    class Meta:
        model = CommentAccommodation
        fields = ['id', 'user', 'post_accommodation', 'created_at', 'updated_at', 'status']


class LikeRequestSerializer(ModelSerializer):
    user = UserSerializer()
    post_request = PostRequestSerializer()

    class Meta:
        model = CommentAccommodation
        fields = ['id', 'user', 'post_request', 'created_at', 'updated_at', 'status']


class FollowSerializer(ModelSerializer):
    owner = UserSerializer()
    follower = UserSerializer()

    class Meta:
        model = Follow
        fields = ['id', 'owner', 'follower', 'created_at', 'updated_at', 'status']
