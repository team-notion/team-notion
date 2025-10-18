from django.urls import path
from .views import CarListView, CarCreateView, CarDetailView, CarUpdateView, ReservationCreateView, CancelReservationView, UserReservationsView

urlpatterns = [
    #Cars
    path('', CarListView.as_view(), name='car-list'),
    path('create/', CarCreateView.as_view(), name='car-create'),
    path("<int:pk>/", CarDetailView.as_view(), name="car-detail"),
    path("<int:pk>/manage/", CarUpdateView.as_view(), name="car-manage"),


    #Reservations
    path('reserve/', ReservationCreateView.as_view(), name='create-reservation'),
    path("reservations/<int:pk>/cancel/", CancelReservationView.as_view(), name="cancel-reservation"),
    path('my-reservations/', UserReservationsView.as_view(), name='user-reservations'),
]

