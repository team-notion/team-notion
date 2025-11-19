from celery import shared_task
from .utils import send_verification_email, send_password_reset_email

@shared_task
def send_verification_email_task(user_id, verify_link):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    user = User.objects.get(id=user_id)
    send_verification_email(user, verify_link)


@shared_task
def send_password_reset_email_task(user_id, reset_link):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    user = User.objects.get(id=user_id)
    send_password_reset_email(user, reset_link)
