from rest_framework import generics, permissions, status    
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response
from .models import Car, Reservation
from .serializers import CarSerializer, ReservationSerializer


class CarListView(generics.ListAPIView):
    queryset = Car.objects.filter(is_available=True)
    serializer_class = CarSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None 


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


class ReservationCreateView(generics.CreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)








class CancelReservationView(generics.UpdateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        reservation_id = kwargs.get("pk")
        try:
            reservation = Reservation.objects.get(id=reservation_id)
        except Reservation.DoesNotExist:
            raise NotFound("Reservation not found.")
        
        if reservation.customer != request.user:
            raise PermissionDenied("You can only cancel your own reservation.")

        if reservation.status in ["cancelled", "completed"]:
            return Response(
                {"detail": "This reservation cannot be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reservation.status = "cancelled"
        reservation.save()

        car = reservation.car
        car.is_available = True
        car.save()

        return Response(
            {"message": "Reservation cancelled successfully."},
            status=status.HTTP_200_OK,
        )



class UserReservationsView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_owner:
            return Reservation.objects.filter(car__owner=self.request.user)
        else:
            return Reservation.objects.filter(customer=self.request.user)
    


