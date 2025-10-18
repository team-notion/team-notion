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
                response = requests.get(image_url)
                if response.status_code == 200:
                    file_name = image_url.split("/")[-1]
                    content = ContentFile(response.content)
                    validated_data["photo"] = content
            except Exception as e:
                raise serializers.ValidationError(
                    {"image_url": f"Failed to fetch image: {e}"}
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

        # Handle photos
        for photo_data in photos_data:
            CarPhoto.objects.create(car=car, **photo_data)

        return car
    



class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'car', 'reserved_from', 'reserved_to', 'status']

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
                available_from = parse_datetime(car.available_dates[0])
                available_to = parse_datetime(car.available_dates[1])
            except Exception:
                raise serializers.ValidationError("Invalid format in car.available_dates.")

            if reserved_from < available_from or reserved_to > available_to:
                raise serializers.ValidationError("Reservation dates must be within the car's available range.")

        # Check if the car has overlapping reservations
        overlapping = Reservation.objects.filter(
            car=car,
            reserved_from__lt=reserved_to,
            reserved_to__gt=reserved_from,
            status__in=['pending', 'confirmed']
        ).exists()

        if overlapping:
            raise serializers.ValidationError("This car is already reserved for the selected dates.")

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        reservation = Reservation.objects.create(
            customer=user,
            **validated_data
        )
        car = reservation.car
        car.is_available = False
        car.save()
        return reservation

