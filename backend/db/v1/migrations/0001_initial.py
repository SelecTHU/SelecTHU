# Generated by Django 5.1.3 on 2024-11-27 08:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CoursesDetails',
            fields=[
                ('course_id', models.CharField(db_column='id', max_length=64, primary_key=True, serialize=False, unique=True)),
                ('info', models.JSONField(db_column='info')),
                ('score', models.FloatField(blank=True, db_column='score', default=-1)),
                ('comments', models.JSONField(blank=True, db_column='comments', default=[])),
            ],
            options={
                'db_table': 'courses_details',
            },
        ),
        migrations.CreateModel(
            name='Curriculum',
            fields=[
                ('curriculum_id', models.CharField(db_column='id', max_length=64, primary_key=True, serialize=False, unique=True)),
                ('courses', models.JSONField(db_column='courses')),
            ],
            options={
                'db_table': 'curriculum',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.CharField(db_column='id', max_length=16, primary_key=True, serialize=False, unique=True)),
                ('user_nickname', models.CharField(db_column='nickname', max_length=64)),
                ('user_avatar', models.ImageField(blank=True, db_column='avatar', default='default_avater.png', upload_to='avatar/')),
                ('user_curriculum', models.CharField(blank=True, db_column='curriculum', default='', max_length=64)),
                ('user_favorite', models.JSONField(blank=True, db_column='favorite', default=[])),
                ('user_decided', models.JSONField(blank=True, db_column='decided', default=[])),
            ],
            options={
                'db_table': 'user',
                'ordering': ['user_id'],
            },
        ),
        migrations.CreateModel(
            name='MainCourses',
            fields=[
                ('course_id', models.CharField(db_column='id', max_length=64, primary_key=True, serialize=False, unique=True)),
                ('code', models.CharField(db_column='code', max_length=16)),
                ('number', models.CharField(db_column='number', max_length=16)),
                ('name', models.CharField(db_column='name', max_length=64)),
                ('teacher', models.CharField(db_column='teacher', max_length=32)),
                ('credit', models.IntegerField(db_column='credit')),
                ('period', models.IntegerField(db_column='period')),
                ('time', models.CharField(db_column='time', max_length=64)),
                ('department', models.CharField(db_column='department', max_length=64)),
                ('course_type', models.CharField(db_column='type', max_length=64)),
                ('capacity', models.IntegerField(db_column='capacity')),
                ('selection', models.JSONField(blank=True, db_column='selection', default={})),
                ('link', models.OneToOneField(db_column='link', on_delete=django.db.models.deletion.CASCADE, to='v1.coursesdetails')),
            ],
            options={
                'db_table': 'main_courses',
                'ordering': ['code'],
            },
        ),
    ]
