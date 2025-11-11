from rest_framework import generics, permissions, status, serializers    
#from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from django.contrib.auth import get_user_model
from threading import Thread
from notifications.utils import create_notification
from .models import Car, Reservation
from .serializers import CarSerializer, AuthReservationSerializer, GuestReservationSerializer
from .utils import send_guest_reservation_email




User = get_user_model()
class CarListView(generics.ListAPIView):
    authentication_classes = [] #comment this line to restrict unverified (is_active = False) users
    permission_classes = [permissions.AllowAny]
    queryset = Car.objects.filter(is_available=True)
    serializer_class = CarSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['daily_rental_price', 'year_of_manufacture']
    ordering = ['daily_rental_price']


    def get_queryset(self):
        queryset = Car.objects.filter(is_available=True)

        # Filters
        #availability
        availability = self.request.query_params.get("is_available")
        if availability is not None:
            queryset = queryset.filter(is_available=availability.lower() in ["true", "1", "yes"])
        else:
            queryset = queryset.filter(is_available=True)

        #owner
        owner_id = self.request.query_params.get("owner_id")
        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)

        #car type
        car_type = self.request.query_params.get("car_type")
        if car_type:
            queryset = queryset.filter(car_type__icontains=car_type)

        #model
        model = self.request.query_params.get("model")
        if model:
            queryset = queryset.filter(model__icontains=model)

        #price range
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            queryset = queryset.filter(daily_rental_price__gte=min_price)
        if max_price:
            queryset = queryset.filter(daily_rental_price__lte=max_price)
        return queryset




class CarCreateView(generics.CreateAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        if not getattr(user, "is_owner", False):
            return Response(
                {"detail": "Only owners can upload cars."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CarDetailView(generics.RetrieveAPIView):
    queryset = Car.objects.filter(is_available=True)
    serializer_class = CarSerializer
    permission_classes = [permissions.AllowAny]

class CarUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "is_owner", False):
            return Car.objects.filter(owner=user)
        return Car.objects.none()

    def update(self, request, *args, **kwargs):
        if not getattr(request.user, "is_owner", False):
            return Response({"detail": "Only owners can update cars."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)


class ReserveCarView(generics.CreateAPIView):
    serializer_class = AuthReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        car_id = self.request.data.get('car')
        customer_username = self.request.data.get('customer_username', None)

        # Get the car object
        try:
            car = Car.objects.get(id=car_id)
        except Car.DoesNotExist:
            raise serializers.ValidationError({"detail": "Car not found."})

        # If user is an owner
        if user.is_owner:
            if car.owner != user:
                raise serializers.ValidationError({"detail": "You can only reserve your own cars for customers."})

            if not customer_username:
                raise serializers.ValidationError({"detail": "Please provide a customer username."})

            try:
                customer = User.objects.get(username=customer_username)
            except User.DoesNotExist:
                raise serializers.ValidationError({"detail": "No user found with that username."})
        else:
            customer = user

        # Check availability
        if not car.is_available:
            raise serializers.ValidationError({"detail": "Car is not available for reservation."})

        # Create the reservation
        reservation = serializer.save(customer=customer, car=car)
        car.is_available = False
        car.save()

        create_notification(
            users=[user, car.owner],
            message=f"Reservation confirmed for {car}.",
            status='success'
        )

        return reservation




class CancelReservationView(generics.UpdateAPIView):
    queryset = Reservation.objects.all()  # ✅ Fix: define queryset
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        reservation = self.get_object()
        user = request.user

        if user != reservation.customer and user != reservation.car.owner:
            return Response(
                {"detail": "You are not allowed to cancel this reservation."},
                status=status.HTTP_403_FORBIDDEN
            )

        if reservation.status == "cancelled":
            return Response(
                {"detail": "This reservation has already been cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        reservation.status = "cancelled"
        reservation.save()

        car = reservation.car
        car.is_available = True
        car.save()

        create_notification(
            users=[user, car.owner],
            message=f"Reservation cancelled for {car}.",
            status='success'
        )

        return Response(
            {"message": "Reservation cancelled successfully."},
            status=status.HTTP_200_OK
        )




class ReservationsView(generics.ListAPIView):
    serializer_class = AuthReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_owner:
            return Reservation.objects.filter(car__owner=self.request.user)
        else:
            return Reservation.objects.filter(customer=self.request.user)
    


class GuestReserveCarView(generics.CreateAPIView):
    serializer_class = GuestReservationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        guest_email = self.request.data.get('guest_email')
        car_id = self.request.data.get('car')

        try:
            car = Car.objects.get(id=car_id)
        except Car.DoesNotExist:
            raise serializers.ValidationError({"detail": "Car not found."})

        reservation = serializer.save(car=car)
        car.is_available = False
        car.save()

        create_notification(
            users=[car.owner],
            message=f"Guest reservation confirmed for {car}. (Guest: {guest_email})",
            status='success'
        )

        Thread(
            target=send_guest_reservation_email, 
            args=(guest_email, car, reservation.reserved_from, reservation.reserved_to, reservation.reservation_code)
        ).start()

        
        return reservation
