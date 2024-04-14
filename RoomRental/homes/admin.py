from django.contrib import admin
from .models import User, Accommodation, AccommodationImage, AccommodationRequest, AccommodationComment, AccommodationFollow, AccommodationSearchHistory, AccommodationUsageStatistic

class AccommodationImageInline(admin.TabularInline):
    model = AccommodationImage

class AccommodationAdmin(admin.ModelAdmin):
    inlines = [AccommodationImageInline]

admin.site.register(User)
admin.site.register(Accommodation, AccommodationAdmin)
admin.site.register(AccommodationRequest)
admin.site.register(AccommodationComment)
admin.site.register(AccommodationFollow)
admin.site.register(AccommodationSearchHistory)
admin.site.register(AccommodationUsageStatistic)

# Register your models here.
