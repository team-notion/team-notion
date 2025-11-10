from rest_framework.permissions import BasePermission

class IsActiveUser(BasePermission):
    message = "Please verify your email to access this feature."

    def has_permission(self, request, view):
        return request.user and request.user.is_active
