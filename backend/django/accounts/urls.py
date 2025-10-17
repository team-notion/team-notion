from django.urls import path
from .views import CustomerRegisterView, OwnerRegisterView, VerifyEmailView, ProfileView, SendVerificationEmailView, RequestPasswordResetView, PasswordResetConfirmView

urlpatterns = [
    path('register/customer/', CustomerRegisterView.as_view(), name='register'),
    path('register/owner/', OwnerRegisterView.as_view(), name='register-owner'),    
    path('profile/', ProfileView.as_view(), name='profile'),

    
    path('verify/send/', SendVerificationEmailView.as_view(), name='send-verification'),
    path('verify/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('password-reset/', RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]


