import string
import random
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime
from decimal import Decimal


def validate_year(value):
    current_year = datetime.now().year
    if value < 1886 or value > current_year:  
        raise ValidationError("Enter a valid year between 1886 and current year.")


class Car(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cars")
    car_type = models.CharField(max_length=100)
    year_of_manufacture = models.PositiveIntegerField(validators=[validate_year], null=True)
    daily_rental_price = models.FloatField(default=0.00)
    rental_terms = models.TextField(blank=True, null=True)
    deposit_percentage = models.FloatField(default=0.00) #add fixed deposit optional column in future
    #available_dates = models.JSONField(blank=True, null=True)  
    
    
    is_available = models.BooleanField(default=True) #substitute for availability

    license = models.TextField()

    color = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=150, blank=True, null=True)
    mileage = models.PositiveIntegerField(blank=True, null=True)
    model = models.CharField(max_length=100, blank=True, null=True)
    duration_non_paid_in_hours = models.PositiveIntegerField(blank=True, null=True)
    features = models.JSONField(blank=True, null=True)

    @property
    def reserved_ranges(self):
        reservations = self.reservations.filter(status__in=["pending", "confirmed"])

        ranges = []
        for r in reservations:
            ranges.append({
                "from": r.reserved_from.date(),
                "to": r.reserved_to.date()
            })
        return ranges
    


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
    reservation_code = models.CharField(
        max_length=6,
        unique=True,
        editable=False
    )
    guest_email = models.EmailField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reserved_from = models.DateTimeField()
    reserved_to = models.DateTimeField()

    # Payment + pricing fields

    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_due = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    new_daily_rental_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)


    has_paid_deposit = models.BooleanField(default=False)
    deposit_deadline = models.DateTimeField(null=True, blank=True) 
    is_cancelled = models.BooleanField(default=False)
    cancel_token = models.CharField(max_length=64, blank=True, null=True)

    notes = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    #is_paid = models.BooleanField(default=False)  ---set this up later for full payment tracking

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if is_new:

            if not self.reservation_code:
                self.reservation_code = self.generate_unique_code()
            

            num_days = Decimal((self.reserved_to.date() - self.reserved_from.date()).days + 1)
            daily_price = Decimal(self.car.daily_rental_price)
            deposit_pct = Decimal(self.car.deposit_percentage) / Decimal("100")           


            self.total_price = num_days * daily_price
            self.deposit_amount = self.total_price * deposit_pct
            self.balance_due = self.total_price
            self.new_daily_rental_price = self.balance_due / num_days

            if self.car.duration_non_paid_in_hours:
                self.deposit_deadline = timezone.now() + timezone.timedelta(
                    hours=self.car.duration_non_paid_in_hours
                )
        super().save(*args, **kwargs)


    def generate_unique_code(self):
        chars = string.ascii_uppercase + string.digits
        while True:
            code = ''.join(random.choices(chars, k=6))
            if not Reservation.objects.filter(reservation_code=code).exists():
                return code
    
    def mark_deposit_paid(self):
        self.has_paid_deposit = True
        self.status = 'confirmed'

    def update_daily_price_after_deposit(self):
        num_days = Decimal((self.reserved_to.date() - self.reserved_from.date()).days + 1)
        self.new_daily_rental_price = self.balance_due / num_days


    def cancel_reservation(self):
        self.is_cancelled = True
        self.status = "cancelled"
        self.cancel_token = None
        self.save(update_fields=["is_cancelled", "status", "cancel_token"])





    def check_and_cancel_if_overdue(self):
        if (
            not self.has_paid_deposit and
            self.deposit_deadline and 
            timezone.now() > self.deposit_deadline
        ):
            self.status = 'cancelled'
            self.is_cancelled = True
            self.save(update_fields=["status", "is_cancelled"])
            return True
        return False
    




    def __str__(self):
        if self.customer:
            return f"{self.customer.email} reserved {self.car.car_type} [{self.reservation_code}]"
        return f"Guest ({self.guest_email}) reserved {self.car.car_type} [{self.reservation_code}]"

    class Meta:
        ordering = ['-reserved_from']
        verbose_name = 'Reservation'
        verbose_name_plural = 'Reservations'


