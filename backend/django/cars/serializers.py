import requests
from django.core.files.base import ContentFile
from rest_framework import serializers
from .models import Car, CarPhoto

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
