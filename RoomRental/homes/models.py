from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('landlord', 'Chủ nhà trọ'),
        ('tenant', 'Người thuê trọ'),
        ('admin', 'Quản trị viên'),
    )
    email = models.EmailField(null=False)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    image = CloudinaryField(null=True)


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True, editable=False)

    class Meta:
        abstract = True


class RoomType(models.TextChoices):
    SHARED = 'SH', 'Shared'
    PRIVATE = 'PR', 'Private'


class PendingStatus(models.TextChoices):
    PENDING = "PD", "Pending"
    APPROVED = "APR", "Approved"
    FAILED = "FL", "Failed"


class PostAccommodation(BaseModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    address = models.CharField(max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    acreage = models.FloatField(null=True, blank=True)
    price = models.FloatField(null=True, blank=True)
    room_type = models.CharField(
        max_length=2,
        choices=RoomType.choices,
        default=RoomType.SHARED,
    )
    max_people = models.IntegerField(default=1)
    current_people = models.IntegerField(default=1)
    phone_number = models.CharField(max_length=12)
    description = RichTextField()
    user_post = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts_accommodation')
    pending_status = models.CharField(
        max_length=3,
        choices=PendingStatus.choices,
        default=PendingStatus.PENDING,
    )


class AccommodationImage(models.Model):
    # image = models.ImageField(upload_to='homes/%Y/%m')
    image = CloudinaryField(null=True)
    caption = models.CharField(max_length=100, blank=True)
    post_accommodation = models.ForeignKey(PostAccommodation, on_delete=models.CASCADE, related_name='images')

    def __str__(self):
        return self.image.url


class PostRequest(BaseModel):
    area = models.CharField(max_length=100, blank=True)
    description = RichTextField()
    user_post = models.ForeignKey(User, on_delete=models.CASCADE)


class Interaction(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class InteractionAccommodation(Interaction):
    post_accommodation = models.ForeignKey(PostAccommodation, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class InteractionRequest(Interaction):
    post_request = models.ForeignKey(PostRequest, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Comment(Interaction):
    content = models.CharField(max_length=255)

    class Meta:
        abstract = True


class CommentAccommodation(Comment, InteractionAccommodation):
    pass


class CommentRequest(Comment, InteractionRequest):
    pass


class Follow(BaseModel):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')


class Like(Interaction):
    class Meta:
        abstract = True


class LikeAccommodation(Like, InteractionAccommodation):
    class Meta:
        unique_together = ('post_accommodation', 'user')


class LikeRequest(Like, InteractionRequest):
    class Meta:
        unique_together = ('post_request', 'user')
