from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import Profile

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    phone_no = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'username', 'phone_no', 'country_code']


    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.save()
        return user



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["is_active"] = user.is_active
        token['is_owner'] = user.is_owner
        return token

    def validate(self, attrs):
        email = attrs.get("email") or attrs.get("username")
        password = attrs.get("password")

        # Authenticate user manually so we can handle inactive ones separately
        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid email or password")

        #allow inactive users to login
        refresh = self.get_token(user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "is_owner": user.is_owner,
            "is_active": user.is_active,
        }
        if not user.is_active:
            data["message"] = "Your account is not verified yet. Some features will be restricted."



        return data




class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user', 'first_name', 'last_name', 'username', 'phone_no', 'country_code', 'date_of_birth',
                  'license_number', 'license_expiry_date', 'license_front_image', 'license_back_image', 'profile_image']
        read_only_fields = ['id', 'user']
