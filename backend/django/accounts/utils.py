#import os
#from django.core.mail import EmailMultiAlternatives
#from django.template.loader import render_to_string
#from django.conf import settings

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import get_user_model
from core.utils import send_email

User = get_user_model()
token_generator = PasswordResetTokenGenerator()

def send_verification_email(user, verify_link):
    subject = "Verify Your Email – Notion Rides 🚘"
    context = {"user": user, "verify_link": verify_link}

    send_email(
        to_email=user.email,
        subject=subject,
        template_name="emails/verify_email.html",
        context=context,
    )
    print("Verification email sent")


def send_password_reset_email(user, reset_link):
    subject = "Password Reset – Notion Rides 🔐"
    context = {"user": user, "reset_link": reset_link}

    send_email(
        to_email=user.email,
        subject=subject,
        template_name="emails/password_reset.html",
        context=context,
    )
    print("Password reset email sent")


"""def send_verification_email(user, verify_link):
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
    print(f"password reset email sent")
"""




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
