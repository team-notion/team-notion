#import os
#import resend
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import get_user_model

User = get_user_model()
token_generator = PasswordResetTokenGenerator()

def send_verification_email(user, verify_link):
    subject = "Verify Your Email – Notion Rides 🚘"
    html_content = render_to_string("emails/verify_email.html", {"user": user, "verify_link": verify_link})
    text_content = f"Hi {user.username}, click the link to verify your email: {verify_link}"

    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [user.email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
    print(f"Verification email sent")

    

def send_password_reset_email(user, reset_link):
    subject = "Password Reset Request – Notion Rides 🔐"
    html_content = render_to_string("emails/password_reset.html", {"user": user, "reset_link": reset_link})
    text_content = f"Hi {user.username}, click the link to reset your password: {reset_link}"

    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [user.email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


#RESEND
"""resend.api_key = os.getenv("RESEND_API_KEY") 

def send_verification_email(user, verify_link):
    subject = "Verify Your Email – Notion Rides 🚘"
    html_content = render_to_string("emails/verify_email.html", {"user": user, "verify_link": verify_link})
    text_content = f"Hi {user.username}, click the link to verify your email: {verify_link}"

    try:
        resend.Emails.send({
            "from": settings.DEFAULT_FROM_EMAIL,  
            "to": user.email,
            "subject": subject,
            "html": html_content,
            "text": text_content,
        })
        print(f"Verification email sent")
    except Exception as e:
        import traceback
        print("⚠️ Failed to send verification email:")
        traceback.print_exc()
        

def send_password_reset_email(user, reset_link):
    subject = "Password Reset Request – Notion Rides 🔐"
    html_content = render_to_string("emails/password_reset.html", {"user": user, "reset_link": reset_link})
    text_content = f"Hi {user.username}, click the link to reset your password: {reset_link}"

    try:
        resend.Emails.send({
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": user.email,
            "subject": subject,
            "html": html_content,
            "text": text_content,
        })
        print(f"Password reset email sent")
    except Exception as e:
        print(f"Failed to send password reset email")"""
    



def generate_token(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = token_generator.make_token(user)
    return uid, token

def verify_token(uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and token_generator.check_token(user, token):
        return user
    return None
