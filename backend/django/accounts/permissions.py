from rest_framework.permissions import BasePermission

class IsActiveUser(BasePermission):
    message = "Please verify your email to access this feature."

    def has_permission(self, request, view):
        return request.user and request.user.is_active


class IsAuthenticatedOrInactive(BasePermission):
    """
    Allows access to authenticated users, even if they are inactive.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated