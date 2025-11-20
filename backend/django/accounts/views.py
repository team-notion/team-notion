import os
from threading import Thread
from django.contrib.auth import get_user_model

from dotenv import load_dotenv
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, ProfileSerializer 
from .utils import send_verification_email, generate_token, verify_token, send_password_reset_email
from .permissions import IsActiveUser
from .authentication import AllowInactiveJWTAuthentication
from .tasks import send_verification_email_task, send_password_reset_email_task

load_dotenv()

User = get_user_model()

frontend_url = os.getenv("FRONTEND_URL", "https://team-notion.netlify.app")


@extend_schema(
    request=RegisterSerializer,
    responses={201: OpenApiExample(
        'Account Created',
        value={'message': 'Account created successfully. Please verify your email.'}
    )},
    description="Registers a new customer account. The user will receive a verification email to activate the account."
)
class CustomerRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    user_flags = {}
    def perform_create(self, serializer):
        flags = getattr(self, "user_flags", {}) or {}
        user = serializer.save(is_active=False, **flags) 


        uid, token = generate_token(user)   

        verify_link = f"{frontend_url}/verify-email/{uid}/{token}/"


        #Thread(target=send_verification_email, args=(user, verify_link)).start()
        send_verification_email_task.delay(user.id, verify_link)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {'message': 'Account created successfully. Please verify your email.'},
            status=status.HTTP_201_CREATED
        )
    

@extend_schema(
    request=RegisterSerializer,
    responses={201: OpenApiExample(
        'Account Created',
        value={'message': 'Account created successfully. Please verify your email.'}
    )},
    description="Registers a new owner account. Owners can upload and manage cars."
)
class OwnerRegisterView(CustomerRegisterView):
    user_flags = {'is_owner': True}



@extend_schema(
    request=None,
    responses={200: OpenApiExample(
        'Verification Sent',
        value={'message': 'Verification email sent'}
    )},
    description="Resend a verification email to the currently authenticated user. Authentication is required."
)
class SendVerificationEmailView(APIView):
    authentication_classes = [AllowInactiveJWTAuthentication]
    permission_classes = [] 

    def post(self, request):
        user = request.user

        if not user.is_authenticated:
            return Response(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if user.is_active:
            return Response(
                {'message': 'Email is already verified'}, 
                status=status.HTTP_200_OK
            )
        
        uid, token = generate_token(user)
        #verify_link = f"{request.scheme}://{request.get_host()}/api/accounts/verify/{uid}/{token}/" ---for testing locally
        verify_link = f"{frontend_url}/verify-email/{uid}/{token}/"
        
        #Thread(target=send_verification_email, args=(user, verify_link)).start()
        send_verification_email_task.delay(user.id, verify_link)

        return Response(
            {'message': 'Verification email sent'}, 
            status=status.HTTP_200_OK
        )

@extend_schema(
    parameters=[
        OpenApiParameter(name='uidb64', description='User ID in base64', required=True, type=str),
        OpenApiParameter(name='token', description='Email verification token', required=True, type=str)
    ],
    responses={
        200: OpenApiExample('Email Verified', value={'message': 'Email verified successfully.'}),
        400: OpenApiExample('Invalid Token', value={'error': 'Invalid or expired token.'})
    },
    description="Verifies a user's email using the UID and token from the verification email."
)
class VerifyEmailView(APIView):
    authentication_classes = [AllowInactiveJWTAuthentication]


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





@extend_schema(
    request=CustomTokenObtainPairSerializer,
    responses={
        200: OpenApiExample(
            'JWT Token',
            value={
                'refresh': 'your_refresh_token',
                'access': 'your_access_token'
            }
        )
    },
    description="Login endpoint that returns JWT access and refresh tokens."
)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@extend_schema(
    request=ProfileSerializer,
    responses={200: ProfileSerializer},
    description="Retrieve and update the authenticated user's profile. PATCH allows partial updates."
)
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_object(self):
        return self.request.user.profile



@extend_schema(
    request=None,
    responses={200: OpenApiExample(
        'Password Reset Sent',
        value={'message': 'Password reset email sent'}
    )},
    description="Sends a password reset email to the user with a reset link."
)
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
        reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"
        
        #Thread(target=send_password_reset_email, args=(user, reset_link)).start()
        send_password_reset_email_task.delay(user.id, reset_link)

        return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)


@extend_schema(
    parameters=[
        OpenApiParameter(name='uidb64', description='User ID in base64', required=True, type=str),
        OpenApiParameter(name='token', description='Password reset token', required=True, type=str)
    ],
    request=None,
    responses={200: OpenApiExample(
        'Password Reset Success',
        value={'message': 'Password reset successful'}
    )},
    description="Confirms password reset using the UID and token. Allows user to set a new password."
)
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


