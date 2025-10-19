from rest_framework import generics, permissions, status, serializers    
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Car, Reservation
from .serializers import CarSerializer, ReservationSerializer
from notifications.utils import create_notification



User = get_user_model()
class CarListView(generics.ListAPIView):
    queryset = Car.objects.filter(is_available=True)
    serializer_class = CarSerializer
    permission_classes = [permissions.AllowAny]


    def get_queryset(self):
        queryset = Car.objects.filter(is_available=True)
        owner_id = self.request.query_params.get('owner_id')

        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)
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
    serializer_class = ReservationSerializer
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

        # ✅ Ensure only the customer or car owner can cancel
        if user != reservation.customer and user != reservation.car.owner:
            return Response(
                {"detail": "You are not allowed to cancel this reservation."},
                status=status.HTTP_403_FORBIDDEN
            )

        # ✅ Prevent cancelling already cancelled ones
        if reservation.status == "cancelled":
            return Response(
                {"detail": "This reservation has already been cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Cancel and update car
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
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_owner:
            return Reservation.objects.filter(car__owner=self.request.user)
        else:
            return Reservation.objects.filter(customer=self.request.user)
    


