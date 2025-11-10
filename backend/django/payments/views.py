from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import initialize_payment
from django.conf import settings
import requests

@api_view(['POST'])
def start_payment(request):
    email = request.data.get('email')
    amount = request.data.get('amount')
    if not email or not amount:
        return Response({'error': 'Email and amount required'}, status=400)

    init_data = initialize_payment(email, amount)
    return Response(init_data)

@api_view(['GET'])
def verify_payment(request):
    reference = request.GET.get('reference')
    url = f'https://api.paystack.co/transaction/verify/{reference}'
    headers = {'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}'}

    response = requests.get(url, headers=headers)
    result = response.json()

    if result['data']['status'] == 'success':
        payment = Payment.objects.get(reference=reference)
        payment.verified = True
        payment.save()
        return Response({'message': 'Payment verified successfully', 'data': result['data']})
    return Response({'error': 'Verification failed', 'data': result['data']})
