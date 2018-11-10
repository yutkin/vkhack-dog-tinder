from django.db import models


class Animal(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=128)
    type = models.CharField(max_length=128)
    description = models.TextField(max_length=1024)
    photo = models.TextField(editable=False)

    class Meta:
        ordering = ('created',)
