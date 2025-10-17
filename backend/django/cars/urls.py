from django.urls import path
from .views import CarListView, CarCreateView, CarDetailView, CarUpdateView 

urlpatterns = [
    path('', CarListView.as_view(), name='car-list'),
    path('create/', CarCreateView.as_view(), name='car-create'),
    path("<int:pk>/", CarDetailView.as_view(), name="car-detail"),
    path("<int:pk>/manage/", CarUpdateView.as_view(), name="car-manage"),
]
