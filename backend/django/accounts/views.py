import threading
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, ProfileSerializer 
from .utils import send_verification_email, generate_token, verify_token, send_password_reset_email


User = get_user_model()


class CustomerRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    def perform_create(self, serializer):
        user = serializer.save(is_active=True) #set to False later if email service is available

        uid, token = generate_token(user)   

        verify_link = f"https://team-notion.netlify.app/verify-email/{uid}/{token}/"

        # Run email sending in a background thread
        threading.Thread(target=send_verification_email, args=(user, verify_link)).start()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {'message': 'Account created successfully. Please verify your email.'},
            status=status.HTTP_201_CREATED
        )

class SendVerificationEmailView(APIView):
    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        uid, token = generate_token(user)
        #verify_link = f"{request.scheme}://{request.get_host()}/api/accounts/verify/{uid}/{token}/"
        verify_link = f"https://team-notion.netlify.app/verify-email/{uid}/{token}/"
        send_verification_email(user, verify_link)
        return Response({'message': 'Verification email sent'}, status=status.HTTP_200_OK)


class VerifyEmailView(APIView):
    def get(self, request, uidb64, token):
        user = verify_token(uidb64, token)

        if not user:
            return Response(
                {'error': 'Invalid or expired token.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if user.is_active:
            return Response(
                {'detail': 'Email already verified.'},
                status=status.HTTP_200_OK
            )
        
        user.is_active = True
        user.save()

        return Response(
            {'message': 'Email verified successfully.'},
            status=status.HTTP_200_OK
        )



class OwnerRegisterView(CustomerRegisterView):
    user_flags = {'is_owner': True}




class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile



#PASSWORD RESET VIEWS
class RequestPasswordResetView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No user with this email'}, status=status.HTTP_404_NOT_FOUND)

        uid, token = generate_token(user)
        #reset_link = f"{request.scheme}://{request.get_host()}/api/accounts/reset/{uid}/{token}/"
        reset_link = f"https://team-notion.netlify.app/reset-password/{uid}/{token}/"
        send_password_reset_email(user, reset_link)
        return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        user = verify_token(uidb64, token)
        if not user:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get('password')
        if not new_password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)


