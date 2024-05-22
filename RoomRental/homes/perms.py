from rest_framework import permissions


class CommentOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_permission(request, view) and request.user == comment.user


from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied


class RestrictTo(permissions.BasePermission):
    """
    Quyền tùy chỉnh chỉ cho phép người dùng thuộc một số loại role nhất định truy cập view.
    """

    def __init__(self, allowed_roles):
        self.allowed_roles = allowed_roles

    def has_permission(self, request, view):
        # Kiểm tra xem người dùng có xác thực không
        if not request.user.is_authenticated:
            return False

        # Kiểm tra xem role của người dùng có nằm trong danh sách được phép không
        if request.user.user_type in self.allowed_roles:
            return True

        # Nếu role không nằm trong danh sách được phép, trả về lỗi 403
        raise PermissionDenied(detail="You don’t have permission to access", code=403)



