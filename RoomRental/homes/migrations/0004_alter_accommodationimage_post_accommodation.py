# Generated by Django 5.0.4 on 2024-05-20 05:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homes', '0003_alter_commentaccommodation_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accommodationimage',
            name='post_accommodation',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='homes.postaccommodation'),
        ),
    ]