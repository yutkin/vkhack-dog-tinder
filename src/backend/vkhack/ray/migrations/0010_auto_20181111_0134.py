# Generated by Django 2.1.3 on 2018-11-10 22:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ray', '0009_auto_20181111_0124'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='photo',
        ),
        migrations.AlterField(
            model_name='task',
            name='owner',
            field=models.IntegerField(),
        ),
    ]
