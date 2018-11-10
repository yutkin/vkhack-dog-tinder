# Generated by Django 2.1.3 on 2018-11-10 12:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Animal",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("name", models.CharField(max_length=128)),
                ("description", models.TextField(max_length=1024)),
                ("photo", models.TextField(editable=False)),
            ],
            options={"ordering": ("created",)},
        )
    ]
