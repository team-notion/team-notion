from django.urls import path
from .views import CarListView, CarCreateView, CarDetailView, CarUpdateView, ReserveCarView, CancelReservationView, ReservationsView, GuestReserveCarView

urlpatterns = [
    #Cars
    path('', CarListView.as_view(), name='car-list'),
    path('create/', CarCreateView.as_view(), name='car-create'),
    path("<int:pk>/", CarDetailView.as_view(), name="car-detail"),
    path("<int:pk>/manage/", CarUpdateView.as_view(), name="car-manage"),


    #Reservations
    path('reserve/', ReserveCarView.as_view(), name='create-reservation'),
    path('reserve/guest/', GuestReserveCarView.as_view(), name='guest-create-reservation'),
    path("reservations/<int:pk>/cancel/", CancelReservationView.as_view(), name="cancel-reservation"),
    path('my-reservations/', ReservationsView.as_view(), name='user-reservations'),
]

