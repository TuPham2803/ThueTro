# Generated by Django 5.0.4 on 2024-06-01 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homes', '0005_postrequest_city_postrequest_district_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='postrequest',
            name='area',
        ),
        migrations.AddField(
            model_name='postrequest',
            name='acreage',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
