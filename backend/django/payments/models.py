from django.db import models
from django.contrib.auth import get_user_model
from cars.models import Reservation

User = get_user_model()

class Payment(models.Model):
    STATUS_CHOICES = [
        ('initialized', 'Initialized'),
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('canceled', 'Canceled'),
    ]

    
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name="payments")
    email = models.EmailField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=100, unique=True)
    verified = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="initialized"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    authorization_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.reference}"
