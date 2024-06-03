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

CLIENT_ID = 'oYGHb8Bt1odfEu8Wz2o8UHyLo52sI4rzCsB0xESW'
CLIENT_SECRET = '5Ztf235KBvE5ycS00gNcJxLMoicbDuslEvenhSufkeUA4mbySMK1lFD9TWljaE3322g2gK9LIIjRQChdk7tbxGCBvV9CNLcpcccSGhqBRXRW1OjOYKd20vTMoKgVxFYl'

CLIENT_ID_KT = 'zvQusM9TN6uYKseb7Mi4p3vwvXO31lEhG0acoZcE'
CLIENT_SECRET_KT = 'N0kSzcvS7aDSuH8kftrMI18LWz7pbsP9sRDafR9XepNzbQ0REJL7lUa9IiAX0kKlJbCo5llXVLiYA98yxNz3Q0meulrES3nG1Hsvq0SksPHVmpRKZKeLJIIIcJjS7V2F'
