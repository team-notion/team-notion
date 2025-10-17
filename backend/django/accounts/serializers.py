from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
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
        user.is_active = False 
        user.save()
        return user



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_owner'] = user.is_owner
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_owner'] = self.user.is_owner
        return data




class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user', 'first_name', 'last_name', 'username', 'phone_no', 'country_code', 'date_of_birth',
                  'license_number', 'license_expiry', 'license_image', 'profile_image']
        read_only_fields = ['id', 'user']
