import requests, json
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

@api_view(['POST'])
def start_payment(request):
    reservation_code = request.data.get("reservation_code")
    amount = request.data.get("amount")

    if not reservation_code or not amount:
        return Response({'error': 'Reservation code and amount are required'}, status=400)
    

    
    try:
        reservation = Reservation.objects.get(reservation_code=reservation_code)
    except Reservation.DoesNotExist:
        return Response({"error": "Invalid reservation code."}, status=400)
    
    if not reservation.has_paid_deposit:
        if amount != reservation.deposit_amount:
                return Response({"error": f"Please enter valid deposit amount: {reservation.deposit_amount}"}, status=400)

    else:
        if not reservation.balance_due - amount < 0:
            if amount != reservation.new_daily_rental_price:
                return Response({"error": f"Please enter valid new daily rental price: {reservation.new_daily_rental_price}"}, status=400)
        else:
            return Response({"error": "No balance due, user has completed payment."})


    
    
    
    # Determine email
    if reservation.guest_email:
        email = reservation.guest_email
    elif hasattr(reservation, 'customer') and reservation.customer.email:
        email = reservation.customer.email
    else:
        return Response({"error": "No email available for this reservation."}, status=400)
    

    payment = Payment.objects.create(
        email=email,
        amount=amount,
        reservation=reservation,
        status="initialized"
    )

    Thread(target=async_initialize_payment, args=(payment,)).start()

    return Response({
        'message': 'Payment initialization in progress',
        "redirect_url": f"/api/payments/{payment.id}/",
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
            reservation = payment.reservation

            payment.verified = True
            payment.status = "success"

            reservation.amount_paid += payment.amount
            reservation.balance_due -= payment.amount

            if not reservation.has_paid_deposit:
                reservation.mark_deposit_paid()
                reservation.update_daily_price_after_deposit()   

            if reservation.balance_due == 0:
                reservation.status = "completed"

            reservation.save(update_fields=["amount_paid", "has_paid_deposit", "balance_due", "new_daily_rental_price", "status"])  
            payment.save(update_fields=["verified", "status"])

            return Response({"message": "Payment verified successfully", "data": result["data"]})
        except Payment.DoesNotExist:
            return Response({"error": "Payment record not found"}, status=404)
    else:
        return Response({"error": "Payment verification failed", "data": result}, status=400)



@api_view(['GET'])
def payment_redirect(request, payment_id):
    try:
        payment = Payment.objects.get(id=payment_id)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=404)

    if payment.status == "failed":
        return Response({"error": "Payment initialization failed"}, status=400)

    if not payment.authorization_url:
        return Response({"message": "Payment still initializing, try again shortly."}, status=202)

    return Response({
        "authorization_url": payment.authorization_url,
        "status": payment.status,
        "payment_id": payment.id
    })