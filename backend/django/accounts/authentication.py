from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

class AllowInactiveJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that allows inactive users.
    """
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        
        # Override the get_user to skip is_active check
        user = self.get_user_allow_inactive(validated_token)
        
        return (user, validated_token)
    
    def get_user_allow_inactive(self, validated_token):
        """
        Get user from token without checking is_active
        """
        from rest_framework_simplejwt.settings import api_settings
        
        try:
            user_id = validated_token[api_settings.USER_ID_CLAIM]
        except KeyError:
            raise InvalidToken('Token contained no recognizable user identification')

        try:
            user = self.user_model.objects.get(pk=user_id)
        except self.user_model.DoesNotExist:
            raise AuthenticationFailed('User not found', code='user_not_found')

        return user