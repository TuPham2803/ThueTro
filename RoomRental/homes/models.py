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
    main_image = CloudinaryField(null=True)
    title = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    ward = models.CharField(max_length=50, default=None)
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
    title = models.CharField(max_length=100, default=None)
    min_price = models.FloatField(default=None)
    max_price = models.FloatField(default=None)
    gender = models.BooleanField(default=1)#1 is female
    description = RichTextField(default=None)
    quanity = models.IntegerField(default=None, null=True)
    city = models.CharField(max_length=50, default=None)
    district = models.CharField(max_length=50, default=None)
    room_type = models.CharField(
        max_length=2,
        choices=RoomType.choices,
        default=RoomType.SHARED,
    )
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


class CommentAccommodation(InteractionAccommodation):
    content = models.CharField(max_length=255)


class CommentRequest(InteractionRequest):
     content = models.CharField(max_length=255)


class Follow(BaseModel):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')

    class Meta:
        unique_together = ('follower', 'owner')


class Like(Interaction):
    class Meta:
        abstract = True


class LikeAccommodation(Like, InteractionAccommodation):
    class Meta:
        unique_together = ('post_accommodation', 'user')


class LikeRequest(Like, InteractionRequest):
    class Meta:
        unique_together = ('post_request', 'user')
