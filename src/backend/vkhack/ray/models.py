from django.db import models


class Animal(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=128)
    type = models.CharField(max_length=128)
    description = models.TextField(max_length=1024)
    photo = models.TextField()

    liked_by_one = models.IntegerField(null=True)
    liked_by_two = models.IntegerField(null=True)

    lat = models.FloatField()
    lon = models.FloatField()

    class Meta:
        ordering = ('created',)


class Task(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=128)
    description = models.TextField()
    time_of_start = models.DateTimeField()
    photo = models.TextField(editable=False)
    owner = models.TextField()

    class Meta:
        ordering = ('created',)
