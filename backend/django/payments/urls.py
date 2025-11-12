# urls.py
from django.urls import path
from .views import start_payment, verify_payment, paystack_callback

urlpatterns = [
    path('start/', start_payment, name='start_payment'),
    path('verify/', verify_payment, name='verify_payment'),
    path('paystack/callback/', paystack_callback, name='paystack_callback'),
]
