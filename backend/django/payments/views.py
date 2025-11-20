import requests, json
from threading import Thread
from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from cars.models import Reservation 
from .utils import async_initialize_payment
from .tasks import async_initialize_payment_task
from .models import Payment


#PS: Use standard logging in production instead of print statements


@extend_schema(
    request={
        "type": "object",
        "properties": {
            "reservation_code": {"type": "string", "example": "RES12345"},
            "amount": {"type": "number", "example": 5000}
        },
        "required": ["reservation_code", "amount"]
    },
    responses={201: OpenApiExample(
        "Payment Initialization Response",
        value={
            "message": "Payment initialization in progress",
            "redirect_url": "/api/payments/1/",
            "payment_id": 1
        }
    )},
    description="Initialize a payment for a reservation. Determines whether the payment is for deposit or balance."
)
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
        currency=reservation.car.currency,        
        status="initialized"
    )

    #Thread(target=async_initialize_payment, args=(payment.id,)).start()
    async_initialize_payment_task.delay(payment.id)

    return Response({
        'message': 'Payment initialization in progress',
        "redirect_url": f"/api/payments/{payment.id}/",
        'payment_id': payment.id
    }, status=201)



@extend_schema(
    parameters=[
        OpenApiParameter(
            name='reference',
            description='Payment reference returned from initialization',
            required=True,
            type=str
        )
    ],
    responses={200: OpenApiExample(
        "Payment Verified",
        value={
            "message": "Payment verified successfully",
            "data": {
                "amount": 5000,
                "currency": "USD",
                "status": "success",
                "reference": "PSK12345XYZ"
            }
        }
    )},
    description="Verify a payment via Paystack using the payment reference."
)
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



@extend_schema(
    parameters=[
        OpenApiParameter(
            name='payment_id',
            description='ID of the payment to fetch authorization URL',
            required=True,
            type=int
        )
    ],
    responses={200: OpenApiExample(
        "Payment Redirect Info",
        value={
            "authorization_url": "https://paystack.com/pay/xyz123",
            "status": "pending",
            "payment_id": 1
        }
    )},
    description="Get the payment authorization URL after initializing a payment. Shows current status."
)
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