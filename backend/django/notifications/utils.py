# cars/utils.py

from .models import Notification

def create_notification(users, message, status='success'):
    if not isinstance(users, (list, tuple)):
        users = [users]

    notifications = [
        Notification(user=user, message=message, status=status)
        for user in users
    ]
    Notification.objects.bulk_create(notifications)
    return notifications
