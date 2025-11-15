import requests
from django.core.files.base import ContentFile
#from django.utils.dateparse import parse_datetime
from django.utils import timezone
from rest_framework import serializers
from .models import Car, CarPhoto, Reservation


class CarPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPhoto
        fields = ["id", "photo", "image_url"]

    def create(self, validated_data):
        photo = validated_data.get("photo")
        image_url = validated_data.get("image_url")

        # If image_url is provided but photo is not, try to download
        if image_url and not photo:
            try:
                response = requests.get(image_url, timeout=10)
                response.raise_for_status()
                file_name = image_url.split("/")[-1] or "downloaded_image.jpg"
                content = ContentFile(response.content, name=file_name)
                validated_data["photo"] = content
            except requests.Timeout:
                raise serializers.ValidationError(
                    {"image_url": "Request timed out while fetching image."}
                )
            except requests.RequestException as e:
                raise serializers.ValidationError(
                    {"image_url": f"Failed to fetch image: {str(e)}"}
                )

        # Raise error if neither photo nor image_url is provided
        if not photo and not validated_data.get("photo"):
            raise serializers.ValidationError(
                {"photo": "Either a photo file or a valid image_url must be provided."}
            )

        return super().create(validated_data)
    
class CarSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    photos = CarPhotoSerializer(many=True, required=True)

    class Meta:
        model = Car
        fields = "__all__"
        read_only_fields = ["owner"]

    def create(self, validated_data):
        photos_data = validated_data.pop("photos", [])
        car = Car.objects.create(**validated_data)

        for photo_data in photos_data:
            photo_serializer = CarPhotoSerializer(data=photo_data, context=self.context)
            if photo_serializer.is_valid(raise_exception=True):
                photo_serializer.save(car=car)
        
        return car

class BaseReservationValidator:
    # Updated to accept car instance directly (instead of car_id)
    def validate_car_instance(self, car):
        # If car is actually an ID (safety check), fetch the instance
        if isinstance(car, int):
            try:
                car = Car.objects.get(id=car)  # Fetch car if only ID provided
            except Car.DoesNotExist:
                raise serializers.ValidationError("Car not found.")
        elif not isinstance(car, Car):
            raise serializers.ValidationError("Invalid car provided.")

        # Check availability
        if not car.is_available:
            raise serializers.ValidationError("This car is currently not available.")

        return car
    
    def validate_dates(self, car, reserved_from, reserved_to):
        if reserved_from >= reserved_to:
            raise serializers.ValidationError("Reservation end date must be after start date.")
    
        if reserved_from.date() == reserved_to.date():
            raise serializers.ValidationError("Reservation must be at least 1 day long.")

        if reserved_from < timezone.now():
            raise serializers.ValidationError("Start date cannot be in the past.")

    def check_overlapping_reservations(self, car, reserved_from, reserved_to):
        overlapping = Reservation.objects.filter(
            car=car,
            reserved_from__lt=reserved_to,
            reserved_to__gt=reserved_from,
            status__in=['pending', 'confirmed']
        ).exists()

        if overlapping:
            raise serializers.ValidationError("This car is already reserved for the selected dates.")


class AuthReservationSerializer(serializers.ModelSerializer, BaseReservationValidator):
    customer_username = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Reservation
        fields = ['id', 'car', 'reservation_code', 'customer', 'customer_username', 'reserved_from', 'reserved_to', 'has_paid_deposit']
        read_only_fields = ['customer', 'reservation_code', 'has_paid_deposit']

    def create(self, validated_data):
        validated_data.pop('customer_username', None)  # Remove extra field before creation
        return super().create(validated_data)

    def validate(self, attrs):
        car = attrs.get('car')  # DRF already gives Car instance
        car = self.validate_car_instance(car)  # Fixed: pass instance directly, not ID

        reserved_from = attrs.get('reserved_from')
        reserved_to = attrs.get('reserved_to')

        self.validate_dates(car, reserved_from, reserved_to)
        self.check_overlapping_reservations(car, reserved_from, reserved_to)

        return attrs
        

class GuestReservationSerializer(serializers.ModelSerializer, BaseReservationValidator):
    guest_email = serializers.EmailField(write_only=True, required=True)

    class Meta:
        model = Reservation
        fields = ['id', 'car', 'guest_email', 'reservation_code', 'reserved_from', 'reserved_to', 'deposit_amount', 'has_paid_deposit']
        read_only_fields = ['has_paid_deposit', 'reservation_code']

    def validate(self, attrs):
        car = attrs.get('car')  # DRF already gives Car instance
        car = self.validate_car_instance(car)  # Fixed: pass instance directly

        reserved_from = attrs.get('reserved_from')
        reserved_to = attrs.get('reserved_to')

        self.validate_dates(car, reserved_from, reserved_to)
        self.check_overlapping_reservations(car, reserved_from, reserved_to)

        return attrs
