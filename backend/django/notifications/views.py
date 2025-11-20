from drf_spectacular.utils import extend_schema, OpenApiExample
from rest_framework import generics, permissions
from .models import Notification
from .serializers import NotificationSerializer

@extend_schema(
    responses={200: OpenApiExample(
        "User Notifications",
        value=[
            {
                "id": 1,
                "message": "Reservation confirmed for Toyota Camry.",
                "status": "success",
                "created_at": "2025-11-20T10:15:30Z",
                "read": False
            },
            {
                "id": 2,
                "message": "Payment verified for your reservation.",
                "status": "success",
                "created_at": "2025-11-19T14:22:10Z",
                "read": True
            }
        ]
    )},
    description="Fetch all notifications for the authenticated user, ordered by newest first."
)
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')



@extend_schema(
    request=NotificationSerializer,
    responses={200: OpenApiExample(
        "Updated Notification",
        value={
            "id": 1,
            "message": "Reservation confirmed for Toyota Camry.",
            "status": "success",
            "created_at": "2025-11-20T10:15:30Z",
            "read": True
        }
    )},
    description="Mark a notification as read or update its content. Only the authenticated user can update their notifications."
)
class NotificationUpdateView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
