from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('landlord', 'Chủ nhà trọ'),
        ('tenant', 'Người thuê trọ'),
        ('admin', 'Quản trị viên'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Accommodation(BaseModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    contact_number = models.CharField(max_length=15)
    description = models.TextField()



class AccommodationImage(models.Model):
    image = models.ImageField(upload_to='homes/%Y/%m')
    caption = models.CharField(max_length=100, blank=True)
    accommodation=models.ForeignKey(Accommodation, on_delete=models.CASCADE)


class AccommodationRequest(BaseModel):
    requester = models.ForeignKey(User, on_delete=models.CASCADE)
    accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE)
    message = models.TextField()
    is_approved = models.BooleanField(default=False)



class AccommodationComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE)
    comment = models.TextField()



class AccommodationFollow(BaseModel):
    follower = models.ForeignKey(User, on_delete=models.CASCADE)
    accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE)


class AccommodationSearchHistory(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=200)
    min_price = models.IntegerField()
    max_price = models.IntegerField()



class AccommodationUsageStatistic(BaseModel):  # Là mô hình để lưu trữ thống kê sử dụng các căn nhà trọ.
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE)
    month = models.IntegerField()
    year = models.IntegerField()
    num_of_views = models.IntegerField()


    def __str__(self):
        return self.name
