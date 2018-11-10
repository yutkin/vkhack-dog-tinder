from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=100, default='')
    description = models.TextField()

    creation_time = models.DateTimeField(auto_now=True)
    demand_time = models.TextField()

    people_needed = models.IntegerField()
    people_ready = models.TextField()

    location = models.TextField()
    contacts = models.TextField()

    # pics = models.ForeignKey()
    # models.ImageField()


    class Meta:
        ordering = ('created',)


    def save(self, *args, **kwargs):
        super(Task, self).save(*args, **kwargs)
