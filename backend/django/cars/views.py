import uuid
from rest_framework import generics, permissions, status, serializers    
#from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from threading import Thread
from notifications.utils import create_notification
from .models import Car, Reservation
from .serializers import CarSerializer, AuthReservationSerializer, GuestReservationSerializer
from .utils import send_guest_reservation_email, send_cancel_confirmation_email
from .tasks import send_cancel_confirmation_email_task, send_guest_reservation_email_task
from .permissions import IsCarOwner



User = get_user_model()

@extend_schema(
    parameters=[
        OpenApiParameter("is_available", description="Filter by availability (true/false)", required=False, type=str),
        OpenApiParameter("owner_id", description="Filter by owner ID", required=False, type=int),
        OpenApiParameter("car_type", description="Filter by car type", required=False, type=str),
        OpenApiParameter("model", description="Filter by car model", required=False, type=str),
        OpenApiParameter("min_price", description="Filter by minimum daily rental price", required=False, type=float),
        OpenApiParameter("max_price", description="Filter by maximum daily rental price", required=False, type=float),
    ],
    responses={200: CarSerializer(many=True)},
    description="Fetch a list of all cars with optional filters for availability, owner, type, model, and price range."
)
class CarListView(generics.ListAPIView):
    authentication_classes = [] #comment this line to restrict unverified (is_active = False) users
    permission_classes = [permissions.AllowAny]
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['daily_rental_price', 'year_of_manufacture']
    ordering = ['daily_rental_price']


    def get_queryset(self):

        queryset = super().get_queryset()

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




@extend_schema(
    request=CarSerializer,
    responses={201: OpenApiExample("Car Created", value={"id": 1, "model": "Toyota Camry", "daily_rental_price": 50})},
    description="Upload a new car. Only authenticated owners can create cars."
)
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


@extend_schema(
    responses={200: CarSerializer},
    description="Fetch details of a single car by ID."
)
class CarDetailView(generics.RetrieveAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(
    request=CarSerializer,
    responses={200: CarSerializer},
    description="Update a car (partial updates allowed) or delete it if no pending/confirmed reservations exist. Only the car owner can perform this action."
)
class CarUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticated, IsCarOwner]

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        car = self.get_object()

        has_active_reservations = Reservation.objects.filter(
            car=car,
            status__in=["pending", "confirmed"]
        ).exists()

        if has_active_reservations:
            return Response(
                {"detail": "Cannot delete this car. There are pending or confirmed reservations."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().destroy(request, *args, **kwargs)



#Reservation for authenticated customers
@extend_schema(
    request=AuthReservationSerializer,
    responses={201: OpenApiExample("Reservation Created", value={
        "id": 1,
        "car": 2,
        "customer": "johndoe",
        "reserved_from": "2025-11-20",
        "reserved_to": "2025-11-22",
        "status": "pending"
    })},
    description="Reserve a car as an authenticated customer. Owners cannot reserve their own cars."
)
class ReserveCarView(generics.CreateAPIView):
    serializer_class = AuthReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        customer_username = self.request.data.get('customer_username', None)


        if user.is_owner and customer_username:
            try:
                customer = User.objects.get(username=customer_username)
                if customer == user:
                    raise serializers.ValidationError({"customer_username": "You cannot reserve your own car for yourself."})
            except User.DoesNotExist:
                raise serializers.ValidationError({"detail": "No user found with that username."})
        else:
            customer = user
            if user.is_owner:
                raise serializers.ValidationError({"detail": "Owners cannot reserve their own cars."})



        reservation = serializer.save(customer=customer)
        car=reservation.car
        car.save()

        create_notification(
            users=[user, car.owner],
            message=f"Reservation confirmed for {car}.",
            status='success'
        )

        return reservation




@extend_schema(
    request=None,
    responses={200: OpenApiExample("Cancel Request Sent", value={"message": "Confirmation email has been sent to j***@example.com"})},
    description="Request cancellation of a reservation. Generates a confirmation token and sends an email to confirm cancellation."
)
class RequestCancelReservationView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        reservation_code = request.data.get("reservation_code")

        if not reservation_code:
            return Response({"detail": "Reservation code is required"}, status=400)

        try:
            reservation = Reservation.objects.get(reservation_code=reservation_code)
        except Reservation.DoesNotExist:
            return Response({"detail": "Invalid reservation code"}, status=404)

        if reservation.is_cancelled:
            return Response({"detail": "Reservation is already cancelled."}, status=400)
        
        if reservation.status == "completed":
            return Response({"detail": "Reservation is already completed."}, status=400)

        today = timezone.now().date()
        if today >= reservation.reserved_from.date():
            return Response({"detail": "You can no longer cancel this reservation because the start has already arrived"})

        # Generate token
        token = uuid.uuid4().hex
        reservation.cancel_token = token
        reservation.save(update_fields=["cancel_token"])

        # Build confirmation link
        confirm_url = request.build_absolute_uri(
            reverse("confirm-cancel-reservation") + f"?token={token}"
        )


        if request.user.is_authenticated:
            email = request.user.email
        else:
            email = reservation.guest_email

        """Thread(
            target=send_cancel_confirmation_email, 
            args=(reservation, confirm_url, email)
        ).start()"""
        send_cancel_confirmation_email_task.delay(
            reservation.id,
            confirm_url,
            email,
        )

        masked_email = self.mask_email(email)

        return Response(
            {"message": f"Confirmation email has been sent to {masked_email}"},
            status=200
        )

    @staticmethod
    def mask_email(email):
        
        name, domain = email.split("@")
        return name[:3] + "***@" + domain


@extend_schema(
    parameters=[OpenApiParameter(name='token', description='Cancellation token from email', required=True, type=str)],
    responses={200: OpenApiExample("Cancelled", value={"message": "Reservation cancelled successfully."})},
    description="Confirm reservation cancellation using the token received via email."
)
class ConfirmCancelReservationView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        token = request.query_params.get("token")

        if not token:
            return Response({"detail": "Token is required"}, status=400)

        try:
            reservation = Reservation.objects.get(cancel_token=token)
        except Reservation.DoesNotExist:
            return Response({"detail": "Invalid or expired token"}, status=400)

        reservation.cancel_reservation()

        return Response(
            {"message": "Reservation cancelled successfully."},
            status=200
        )


@extend_schema(
    responses={200: AuthReservationSerializer(many=True)},
    description="List reservations. Owners see reservations for their cars. Customers see their own reservations."
)
class ReservationsView(generics.ListAPIView):
    serializer_class = AuthReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_owner:
            return Reservation.objects.filter(car__owner=self.request.user)
        else:
            return Reservation.objects.filter(customer=self.request.user)
    

@extend_schema(
    request=GuestReservationSerializer,
    responses={201: OpenApiExample("Guest Reservation Created", value={
        "id": 1,
        "car": 2,
        "guest_email": "guest@example.com",
        "reserved_from": "2025-11-20",
        "reserved_to": "2025-11-22",
        "status": "pending"
    })},
    description="Reserve a car as a guest without authentication. Sends a confirmation email to the guest."
)
class GuestReserveCarView(generics.CreateAPIView):
    serializer_class = GuestReservationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        guest_email = self.request.data.get('guest_email')

        if User.objects.filter(email__iexact=guest_email).exists():
            raise serializers.ValidationError({
                "detail": "This email is already registered. Please login to continue."
            })

        reservation = serializer.save()

        car = reservation.car 
        car.save()

        create_notification(
            users=[car.owner],
            message=f"Guest reservation confirmed for {car}. (Guest: {guest_email})",
            status='success'
        )

        """Thread(
            target=send_guest_reservation_email, 
            args=(guest_email, car, reservation.reserved_from, reservation.reserved_to, reservation.reservation_code)
        ).start()"""
        send_guest_reservation_email_task.delay(
            guest_email,
            car.id,
            reservation.start_date.isoformat(),
            reservation.end_date.isoformat(),
            reservation.code,
        )

        
        return reservation
