from django.contrib import admin
from django.template.response import TemplateResponse

from .models import User, PostAccommodation, AccommodationImage, InteractionAccommodation, Follow, PostRequest, \
    UserAvatarImage
import cloudinary
from django.utils.html import mark_safe
from django.urls import path

class MyAdminSite(admin.AdminSite):
    site_header = 'Admin_Room'

    def get_urls(self):
        return [path('cate-stats/', self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        return TemplateResponse(request, 'admin/stats.html', {

        })

admin_site = MyAdminSite(name='Admin_Room')

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
    list_filter = ['pending_status', 'active']

    def my_image(self, instance):
        if instance:
            if instance.image is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='120' src='{instance.image.url}' />")

            return mark_safe(f"<img width='120' src='/static/{instance.image.name}' />")


admin_site.register(User, MyUserAdmin)
admin_site.register(PostAccommodation, MyAccommodationAdmin)
admin_site.register(PostRequest)
# admin.site.register(Comment)
admin_site.register(Follow)
# admin.site.register(Like)

# Register your models here.
