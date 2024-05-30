from django.contrib import admin
from django.template.response import TemplateResponse
from .models import User, PostAccommodation, AccommodationImage, InteractionAccommodation, Follow, PostRequest, CommentAccommodation
import cloudinary
from django.contrib import admin
from django.utils.html import mark_safe
from django.urls import path


class MyAdminSite(admin.AdminSite):
    site_header = 'Admin_Room'

    def get_urls(self):
        return [path('user-stats/', self.stats_view)] + [
            path('reviewing-posts/', self.reviewing_posts)] + super().get_urls()

    def stats_view(self, request):
        return TemplateResponse(request, 'admin/user_stats.html', {})

    def reviewing_posts(self, request):
        return TemplateResponse(request, 'admin/reviewing_posts.html', {})

    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        app_list += [
            {
                "name": "Action",
                # "app_label": "my_test_app",
                # "app_url": "/admin/test_view",
                "models": [
                    {
                        "name": "Users stats",
                        "admin_url": "/admin/user-stats/",
                        "view_only": True,
                    }, {
                        "name": "Reviewing posts",
                        "admin_url": "/admin/reviewing-posts/",
                        "view_only": True,
                    }

                ],
            }
        ]
        return app_list


admin_site = MyAdminSite(name='Admin_Room')


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


admin_site.register(User)
admin_site.register(PostAccommodation, MyAccommodationAdmin)
admin_site.register(PostRequest)
admin_site.register(Follow)
admin_site.register(CommentAccommodation)
# Register your models here.
