# Generated by Django 5.1.3 on 2024-12-09 15:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('v1', '0006_alter_maincourses_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_avatar',
            field=models.ImageField(blank=True, db_column='avatar', default='avatar/default_avatar.png', upload_to='avatar/'),
        ),
    ]