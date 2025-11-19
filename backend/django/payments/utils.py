import requests
import os
from django.conf import settings
from dotenv import load_dotenv
from .models import Payment

load_dotenv()


callback_url = os.getenv("CALLBACK_URL", "http://localhost:8000/api/payments/verify/")

def initialize_payment(email, amount, currency):
    """
    Initialize payment with Paystackc
    amount is in Naira — Paystack expects amount in Kobo (multiply by 100)
    """
    url = 'https://api.paystack.co/transaction/initialize'
    headers = {
        'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
        'Content-Type': 'application/json'
    }


    data = {
        'email': email,
        'currency': currency,
        'amount': int(amount) * 100,  # Convert to Kobo
        'callback_url': callback_url,
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

def async_initialize_payment(payment_id):
    payment = Payment.objects.get(id=payment_id)

    try:
        data = initialize_payment(payment.email, payment.amount, payment.currency)
        if data.get("status") and data.get("data") and "reference" in data["data"]:
            payment.reference = data["data"]["reference"]
            payment.status = "pending"
            payment.authorization_url = data["data"].get("authorization_url")  
            payment.save()
            print("payment successfully initialized")
        else:
            payment.status = "failed"
            payment.save()
            print("Payment initialization failed:", data)
    except Exception as e:
        payment.status = "failed"
        payment.save()
        print(f"Payment initialization failed: {str(e)}")