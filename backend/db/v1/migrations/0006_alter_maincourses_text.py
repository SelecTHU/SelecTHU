# Generated by Django 5.1.3 on 2024-12-05 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('v1', '0005_alter_maincourses_grade'),
    ]

    operations = [
        migrations.AlterField(
            model_name='maincourses',
            name='text',
            field=models.CharField(db_column='text', max_length=512),
        ),
    ]
