from rest_framework import viewsets, permissions
from .models import Accommodation
from .serializers import AccommodationSerializer


class AccommdationViewSet(viewsets.ModelViewSet):
    queryset = Accommodation.objects.filter(status=True)
    serializer_class = AccommodationSerializer
    permission_classes = [permissions.IsAuthenticated]
