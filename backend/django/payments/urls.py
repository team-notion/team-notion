# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.start_payment, name='start_payment'),
    path('verify/', views.verify_payment, name='verify_payment'),
]
