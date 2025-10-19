from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from datetime import datetime

def validate_year(value):
    current_year = datetime.now().year
    if value < 1886 or value > current_year:  
        raise ValidationError("Enter a valid year between 1886 and current year.")


class Car(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cars")
    car_type = models.CharField(max_length=100)
    year_of_manufacture = models.PositiveIntegerField(validators=[validate_year], null=True)
    daily_rental_price = models.FloatField(default=0.00)
    available_dates = models.JSONField(blank=True, null=True)  
    rental_terms = models.TextField(blank=True, null=True)
    deposit = models.FloatField(default=0.00)
    deposit_percentage = models.FloatField(default=0.00)
    is_available = models.BooleanField(default=True)
    license = models.TextField()

    def __str__(self):
        return f"{self.car_type} ({self.owner.profile.username})"


class CarPhoto(models.Model):
    car = models.ForeignKey(Car, related_name="photos", on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="cars/photos/", blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"Photo for {self.car.car_type}"



class Reservation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    car = models.ForeignKey(
        'Car',
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reservations'
    )
    guest_email = models.EmailField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reserved_from = models.DateTimeField()
    reserved_to = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.customer:
            return f"{self.customer.email} reserved {self.car.car_type}"
        return f"Guest ({self.guest_email}) reserved {self.car.car_type}"

    class Meta:
        ordering = ['-reserved_from']
        verbose_name = 'Reservation'
        verbose_name_plural = 'Reservations'


