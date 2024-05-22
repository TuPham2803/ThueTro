from .models import User, PostAccommodation, AccommodationImage, InteractionAccommodation, Follow, PostRequest
import cloudinary
from django.contrib import admin
from django.utils.html import mark_safe


class AccommodationImageInline(admin.TabularInline):
    model = AccommodationImage
    readonly_fields = ['my_image']

    def my_image(self, instance):
        if instance:
            if instance.image is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='120' src='{instance.image.url}' />")

            return mark_safe(f"<img width='120' src='{instance.image.url}' />")


class MyAccommodationAdmin(admin.ModelAdmin):
    inlines = [AccommodationImageInline]
    list_filter = ['pending_status', 'active']


admin.site.register(User)
admin.site.register(PostAccommodation, MyAccommodationAdmin)
admin.site.register(PostRequest)
# admin.site.register(Comment)
admin.site.register(Follow)
# admin.site.register(Like)

# Register your models here.
