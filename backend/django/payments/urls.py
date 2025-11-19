# urls.py
from django.urls import path
from .views import start_payment, verify_payment, payment_redirect

urlpatterns = [
    path('start/', start_payment, name='start_payment'),
    path('verify/', verify_payment, name='verify_payment'),
    path('<int:payment_id>/', payment_redirect, name='payment_redirect'),
]
