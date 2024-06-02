from datetime import datetime

from django.db.models import Count
from django.db.models.functions import ExtractMonth, ExtractYear, ExtractQuarter
from rest_framework import viewsets, permissions, status, generics, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import PostAccommodation, User, PostRequest, CommentAccommodation, CommentRequest, LikeAccommodation, \
    LikeRequest, AccommodationImage, PendingStatus
from . import serializers, perms
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .perms import RestrictTo
import cloudinary
from .sendmail import send_mail
from threading import Thread
from .pagination import SmallPagination










