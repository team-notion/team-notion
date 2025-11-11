from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


def send_guest_reservation_email(guest_email, car, reserved_from, reserved_to):
    subject = f"Reservation Confirmed for {car}"

    html_message = render_to_string("notify_guest.html", {
        "car": car,
        "reserved_from": reserved_from,
        "reserved_to": reserved_to,
    })

    # Plain text fallback
    text_message = (
        f"Your reservation for {car} has been confirmed.\n\n"
        f"From: {reserved_from}\n"
        f"To: {reserved_to}\n\n"
        f"Thank you for choosing our service."
    )

    msg = EmailMultiAlternatives(
        subject,
        text_message,
        settings.DEFAULT_FROM_EMAIL,
        [guest_email],
    )
    msg.attach_alternative(html_message, "text/html")
    msg.send()
    print(f"Email sent successfully to guest")