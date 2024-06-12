"""
URL configuration for RoomRental project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from homes.admin import admin_site

schema_view = get_schema_view(
    openapi.Info(
        title="Course API",
        default_version='v1',
        description="APIs for CourseApp",
        contact=openapi.Contact(email="TuTu@gmail.com"),
        license=openapi.License(name="Tu Tu@2024"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', include('homes.urls')),
    path('admin/', admin_site.urls),
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0),
            name='schema-json'),
    re_path(r'^swagger/$',
            schema_view.with_ui('swagger', cache_timeout=0),
            name='schema-swagger-ui'),
    re_path(r'^redoc/$',
            schema_view.with_ui('redoc', cache_timeout=0),
            name='schema-redoc'),

    path('o/', include('oauth2_provider.urls',
                       namespace='oauth2_provider')),
]

CLIENT_ID = 'Eh65pe9lGWTeVJBzZBj4sNbgshpOlEWvnLZ0en3b'
CLIENT_SECRET = 'mWbFHj6vwBRccXBwvOtQMLrOmuUmZiAjjTLFRCEma8zISfOr6p8zHyDnhYYMcVY85ac4AOgme4KlONf9i2VmNaSGkayLmnZo5KC6tvQ9bbjFuPc8yandkEvaSmjljzWh'

CLIENT_ID_KT = 'zvQusM9TN6uYKseb7Mi4p3vwvXO31lEhG0acoZcE'
CLIENT_SECRET_KT = 'N0kSzcvS7aDSuH8kftrMI18LWz7pbsP9sRDafR9XepNzbQ0REJL7lUa9IiAX0kKlJbCo5llXVLiYA98yxNz3Q0meulrES3nG1Hsvq0SksPHVmpRKZKeLJIIIcJjS7V2F'

CLIENT_ID_KT2 ='IOSdbDmvUpezsBSIGDCzdIK5qw3FRcYFe0URxei6'
CLIENT_SECRET_KT2='nh5yDJx4PRAkhuE9lU9hXPXquXiwHziiwDOprR84KvXdiSfpgvOZa7kRQbPxEmXCxwrl3QUOX7ezieQmh77sKR3qzg57NemYoYLiUpzEXf89HlRWPxKDQdYZB9iR1ZNx'

CLIENT_ID_PN ='G6Jgx3Hg68LdrAKvCkFIs45o9TMsrpvy4XVVHVee'
CLIENT_SECRET_PN='IrooDFZD6dTd1hbzrsza0Tqgy8KFIhZQQT3abYFv7YgoZpWR6CC492KpXru46wKbLilGzXto5btd4I2OhQ5bfaNqHs9MNiVuvHdAZ2rQa149jR6I1m85MszgMOvf6z9q'