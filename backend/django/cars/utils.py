#from django.core.mail import EmailMultiAlternatives
#from django.template.loader import render_to_string
from django.conf import settings
from core.utils import send_email


def send_guest_reservation_email(guest_email, car, reserved_from, reserved_to, reservation_code):
    subject = f"Reservation Confirmed for {car}"

    context= {
        "car": car,
        "reserved_from": reserved_from,
        "reserved_to": reserved_to,
        "reservation_code": reservation_code, 
    }

    send_email(
        to_email=guest_email,
        subject=subject,
        template_name="emails/notify_guest.html",
        context=context,
    )
    print(f"Email sent successfully to guest")


def send_cancel_confirmation_email(reservation, confirm_url, email):
    subject = "Confirm Reservation Cancellation – Notion Rides"

    context = {
        "reservation": reservation,
        "confirm_url": confirm_url,
    }

    send_email(
        to_email=email,
        subject=subject,
        template_name="emails/cancel_reservation.html",
        context=context,
    )

    print("Cancellation confirmation email sent")
