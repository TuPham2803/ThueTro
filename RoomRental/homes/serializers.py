from rest_framework.serializers import ModelSerializer
from .models import Accommodation


class AccommodationSerializer(ModelSerializer):
    class Meta:
        model = Accommodation
        fields = ['owner', 'title', 'address', 'contact_number', 'description']
