# Generated by Django 2.1.3 on 2018-11-11 06:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ray', '0014_remove_task_persons_applied'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='persons_applied',
            field=models.TextField(default=''),
        ),
    ]
