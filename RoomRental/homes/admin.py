from django.contrib import admin
from .models import User, PostAccommodation, AccommodationImage, InteractionAccommodation, Follow, PostRequest, \
    UserAvatarImage
import cloudinary
from django.utils.html import mark_safe


class AccommodationImageInline(admin.TabularInline):
    model = AccommodationImage


class UserAvatarImageInline(admin.TabularInline):
    model = UserAvatarImage


class MyUserAdmin(admin.ModelAdmin):
    inlines = [UserAvatarImageInline]

    def my_image(self, instance):
        if instance:
            if instance.image is cloudinary.CloudinaryResource:
                return mark_safe(f"<img src='{instance.image.url}' />")

            return mark_safe(f"<img width='120' src='/static/{instance.image.name}' />")


class MyAccommodationAdmin(admin.ModelAdmin):
    inlines = [AccommodationImageInline]
    list_filter = ['id', 'status']

    def my_image(self, instance):
        if instance:
            if instance.image is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='120' src='{instance.image.url}' />")

            return mark_safe(f"<img width='120' src='/static/{instance.image.name}' />")


admin.site.register(User, MyUserAdmin)
admin.site.register(PostAccommodation, MyAccommodationAdmin)
admin.site.register(PostRequest)
# admin.site.register(Comment)
admin.site.register(Follow)
# admin.site.register(Like)

# Register your models here.
