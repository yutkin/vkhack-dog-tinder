from rest_framework import serializers
from ray.models import Animal


class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ('id', 'name', 'type', 'description', 'photo')
