from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()

class AllowInactiveUserLoginBackend(ModelBackend):
    """
    Custom authentication backend that allows inactive users to authenticate.
    """
    def user_can_authenticate(self, user):
        return True  # Allow all users, regardless of is_active status
    

    