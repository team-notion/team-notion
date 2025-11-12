import requests
from threading import Thread
from django.conf import settings
from django.urls import reverse
from django.test import Client
from rest_framework.decorators import api_view
from rest_framework.response import Response
from cars.models import Reservation 
from .utils import initialize_payment
from .models import Payment


#PS: Use standard logging in production instead of print statements

def async_initialize_payment(payment):
    try:
        data = initialize_payment(payment.email, payment.amount)
        if data.get("status") and data.get("data") and "reference" in data["data"]:
            payment.reference = data["data"]["reference"]
            payment.status = "pending"
            payment.save()
        else:
            payment.status = "failed"
            payment.save()
            print("Payment initialization failed:", data)
    except Exception as e:
        payment.status = "failed"
        payment.save()
        print(f"Payment initialization failed: {str(e)}")

@api_view(['POST'])
def start_payment(request):
    email = request.data.get('email')
    amount = request.data.get('amount')
    reservation_code = request.data.get("reservation_code")

    if not email or not amount or not reservation_code:
        return Response({'error': 'Email, reservation code, and amount required'}, status=400)
    
    try:
        reservation = Reservation.objects.get(code=reservation_code)
    except Reservation.DoesNotExist:
        return Response(
            {"error": "Invalid reservation code."},
            status=400
        )
    
    if reservation.is_paid:
            return Response(
                {"error": "This reservation has already been paid."},
                status=400
            )
    

    payment = Payment.objects.create(
        email=email,
        amount=amount,
        reservation=reservation,
        status="initialized"
    )

    Thread(target=async_initialize_payment, args=(payment,)).start()

    return Response({
        'message': 'Payment initialization in progress',
        'payment_id': payment.id
    }, status=201)

@api_view(['GET'])
def verify_payment(request):
    reference = request.GET.get('reference')
    url = f'https://api.paystack.co/transaction/verify/{reference}'
    headers = {'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}'}

    response = requests.get(url, headers=headers)
    result = response.json()

    if result.get("status") and result["data"]["status"] == "success":
        try:
            payment = Payment.objects.get(reference=reference)
            payment.verified = True
            payment.status = "success"
            payment.reservation.is_paid = True
            payment.reservation.save()  
            payment.save()
        except Payment.DoesNotExist:
            return Response({"error": "Payment record not found"}, status=404)


#for testing callback handling locally
@api_view(['GET'])
def paystack_callback(request):
    """
    Temporary callback endpoint to simulate frontend action.
    It calls /verify_payment internally and returns the result.
    """
    reference = request.GET.get('reference') or request.GET.get('trxref')
    if not reference:
        return Response({'error': 'No reference provided'}, status=400)

    # Use Django test Client to call verify_payment internally
    client = Client()
    verify_url = reverse('verify_payment')  # make sure your verify_payment view has name='verify_payment'
    response = client.get(verify_url, {'reference': reference})

    # Return the response as-is
    return Response(response.json(), status=response.status_code)