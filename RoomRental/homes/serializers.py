from rest_framework.serializers import ModelSerializer
from .models import PostAccommodation, User
from . import perms


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


class AccommodationSerializer(ModelSerializer):
    class Meta:
        model = PostAccommodation
        fields = ['owner', 'title', 'address', 'contact_number', 'description']

# class CommentSerializer(ModelSerializer):
#     user= UserSerializer()
#     class Meta:
#         model = Comment
#         fields = ['id', 'user', 'accommodation', 'comment', 'created_at', 'updated_at']
#         read_only_fields = ['created_at', 'updated_at']
