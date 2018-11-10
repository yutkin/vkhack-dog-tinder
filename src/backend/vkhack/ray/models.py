from django.db import models


class Animal(models.Model):
    created = models.DateTimeField(auto_now_add=True, db_index=True)
    name = models.CharField(max_length=128)
    type = models.CharField(max_length=128)
    description = models.TextField()
    photo = models.TextField()

    liked_by_one = models.IntegerField(null=True, db_index=True)
    liked_by_two = models.IntegerField(null=True, db_index=True)

    lat = models.FloatField()
    lon = models.FloatField()

    class Meta:
        ordering = ("created",)


class Task(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=128)
    description = models.TextField()
    type = models.CharField(max_length=128)

    start_date = models.DateTimeField()

    persons_needed = models.IntegerField()
    persons_applied = models.IntegerField(default=0)

    lat = models.FloatField()
    lon = models.FloatField()

    owner = models.IntegerField()

    class Meta:
        ordering = ("created",)
