from django.contrib import admin
from .models import User, PostAccommodation, AccommodationImage, InteractionAccommodation, Follow, PostRequest


class AccommodationImageInline(admin.TabularInline):
    model = AccommodationImage


class AccommodationAdmin(admin.ModelAdmin):
    inlines = [AccommodationImageInline]


admin.site.register(User)
admin.site.register(PostAccommodation, AccommodationAdmin)
admin.site.register(PostRequest)
# admin.site.register(Comment)
admin.site.register(Follow)
# admin.site.register(Like)

# Register your models here.
