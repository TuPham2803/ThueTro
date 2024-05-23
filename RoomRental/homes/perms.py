from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from .models import User, Follow

class CommentOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_permission(request, view) and request.user == comment.user

class IsTenantAndFollowLandlord(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, user):
        return super().has_permission(request, view) and user.user_type == 'landlord'

class RestrictTo(BasePermission):
    def __init__(self, allowed_user_types):
        self.allowed_user_types = allowed_user_types

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.user_type not in self.allowed_user_types:
            raise PermissionDenied("You do not have permission to perform this action.")
        return True











