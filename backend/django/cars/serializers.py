import requests
from django.core.files.base import ContentFile
from django.utils.dateparse import parse_datetime
from rest_framework import serializers
from .models import Car, CarPhoto, Reservation


class CarPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPhoto
        fields = ["id", "photo", "image_url"]

    def create(self, validated_data):
        image_url = validated_data.get("image_url")
        photo = validated_data.get("photo")

        if image_url and not photo:
            try:
                response = requests.get(image_url, timeout=10)
                if response.status_code == 200:
                    file_name = image_url.split("/")[-1] or "downloaded_image.jpg"
                    content = ContentFile(response.content, name=file_name)
                    validated_data["photo"] = content
            except requests.Timeout:
                validated_data["photo"] = None 
                raise serializers.ValidationError(
                    {"image_url": "Request timed out while fetching image"}
                )
            except Exception as e:
                validated_data["photo"] = None 
                raise serializers.ValidationError(
                    {"image_url": f"Failed to fetch image: {str(e)}"}
                )
        if not photo and not image_url:
            raise serializers.ValidationError(
                {"photo": "Either a photo file or image_url must be provided."}
            )
        return super().create(validated_data)
    
class CarSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    photos = CarPhotoSerializer(many=True, required=False)

    class Meta:
        model = Car
        fields = "__all__"
        read_only_fields = ["owner"]

    def create(self, validated_data):
        photos_data = validated_data.pop("photos", [])
        car = Car.objects.create(**validated_data)

        for photo_data in photos_data:
            photo_serializer = CarPhotoSerializer(data=photo_data)
            if photo_serializer.is_valid():
                photo_serializer.save(car=car)
            else:
                raise serializers.ValidationError({"photos": photo_serializer.errors})
        
        return car


    

class AuthReservationSerializer(serializers.ModelSerializer):
    customer_username = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Reservation
        fields = ['id', 'car', 'reservation_code', 'customer', 'customer_username', 'reserved_from', 'reserved_to']
        read_only_fields = ['customer', 'reservation_code']

    def create(self, validated_data):
        
        validated_data.pop('customer_username', None)
        return super().create(validated_data)

    def validate(self, attrs):
        car = attrs.get('car')
        reserved_from = attrs.get('reserved_from')
        reserved_to = attrs.get('reserved_to')

        if reserved_from >= reserved_to:
            raise serializers.ValidationError("Reservation end date must be after start date.")

        if not car.is_available:
            raise serializers.ValidationError("This car is currently not available.")
        
        if car.available_dates:
            try:
                from django.utils.dateparse import parse_datetime

                parsed_dates = [
                    parse_datetime(dt) for dt in car.available_dates if parse_datetime(dt)
                ]

                if not parsed_dates:
                    raise ValueError("No valid datetime found in available_dates.")

                available_from = min(parsed_dates)
                available_to = max(parsed_dates)

                if available_from is None or available_to is None:
                    raise ValueError("Invalid datetime format")
            except Exception:
                raise serializers.ValidationError("Invalid format in car.available_dates.")

            if reserved_from < available_from or reserved_to > available_to:
                raise serializers.ValidationError("Reservation dates must be within the car's available range.")

        # Check overlapping reservations
        overlapping = Reservation.objects.filter(
            car=car,
            reserved_from__lt=reserved_to,
            reserved_to__gt=reserved_from,
            status__in=['pending', 'confirmed']
        ).exists()

        if overlapping:
            raise serializers.ValidationError("This car is already reserved for the selected dates.")

        return attrs


class GuestReservationSerializer(serializers.ModelSerializer):
    guest_email = serializers.EmailField(write_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'car', 'guest_email', 'reserved_from', 'reserved_to']

    def validate(self, attrs):
        car = attrs.get('car')
        reserved_from = attrs.get('reserved_from')
        reserved_to = attrs.get('reserved_to')

        if reserved_from >= reserved_to:
            raise serializers.ValidationError("Reservation end date must be after start date.")

        if not car.is_available:
            raise serializers.ValidationError("This car is currently not available.")

        overlapping = Reservation.objects.filter(
            car=car,
            reserved_from__lt=reserved_to,
            reserved_to__gt=reserved_from,
            status__in=['pending', 'confirmed']
        ).exists()

        if overlapping:
            raise serializers.ValidationError("This car is already reserved for the selected dates.")

        return attrs
