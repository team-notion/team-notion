from celery import shared_task
from django.utils import timezone
from .models import Reservation
from .utils import send_guest_reservation_email, send_cancel_confirmation_email

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



@shared_task
def send_guest_reservation_email_task(guest_email, car_id, reserved_from, reserved_to, reservation_code):
    from cars.models import Car
    car = Car.objects.get(id=car_id)

    send_guest_reservation_email(
        guest_email,
        car,
        reserved_from,
        reserved_to,
        reservation_code,
    )


@shared_task
def send_cancel_confirmation_email_task(reservation_id, confirm_url, email):
    from notifications.models import Reservation
    reservation = Reservation.objects.get(id=reservation_id)

    send_cancel_confirmation_email(
        reservation,
        confirm_url,
        email,
    )
