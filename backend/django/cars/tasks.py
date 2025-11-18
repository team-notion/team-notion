from celery import shared_task
from django.utils import timezone
from .models import Reservation

@shared_task
def cancel_overdue_deposits_task():
    now = timezone.now()
    overdue = Reservation.objects.filter(
        has_paid_deposit=False,
        deposit_deadline__lt=now,
        is_cancelled=False,
        status__in=["pending"],
    )

    for reservation in overdue:
        reservation.cancel_reservation()

    return f"Cancelled {overdue.count()} overdue reservations"
