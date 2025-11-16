import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.template.loader import render_to_string
from django.conf import settings


def send_email(to_email, subject, template_name, context):
    html_content = render_to_string(template_name, context)

    # Plain text fallback (auto generated)
    text_content = (
        html_content.replace("<br>", "\n")
        .replace("<br/>", "\n")
        .replace("<strong>", "")
        .replace("</strong>", "")
        .strip()
    )

    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=to_email,
        subject=subject,
        html_content=html_content,
    )

    try:
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY", "")   )
        response = sg.send(message)
        print("Email sent:", response.status_code)
        return response.status_code

    except Exception as e:
        print("SendGrid Error:", str(e))
        return None
