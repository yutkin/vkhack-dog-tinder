# Generated by Django 2.1.3 on 2018-11-11 06:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ray', '0011_auto_20181111_0159'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='persons_applied',
            field=models.TextField(),
        ),
    ]