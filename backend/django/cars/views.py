from rest_framework import generics, permissions, status    
from rest_framework.response import Response
from .models import Car
from .serializers import CarSerializer


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