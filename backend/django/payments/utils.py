import requests
from django.conf import settings

def initialize_payment(email, amount):
    """
    Initialize payment with Paystack
    amount is in Naira — Paystack expects amount in Kobo (multiply by 100)
    """
    url = 'https://api.paystack.co/transaction/initialize'
    headers = {
        'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'email': email,
        'amount': int(amount) * 100,  # Convert to Kobo
        'callback_url': 'http://localhost:8000/api/paystack/callback/',
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
