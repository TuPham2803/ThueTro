from django.contrib import admin
from .models import User, Accommodation, AccommodationImage, Request, Comment, Follow, SearchHistory, \
    AccommodationUsageStatistic


class AccommodationImageInline(admin.TabularInline):
    model = AccommodationImage


class AccommodationAdmin(admin.ModelAdmin):
    inlines = [AccommodationImageInline]


admin.site.register(User)
admin.site.register(Accommodation, AccommodationAdmin)
admin.site.register(Request)
admin.site.register(Comment)
admin.site.register(Follow)
admin.site.register(SearchHistory)
admin.site.register(AccommodationUsageStatistic)

# Register your models here.
