# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-06 07:22
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Measurement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('measurement_date', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='MeasurementRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.FloatField()),
                ('temperature', models.FloatField()),
                ('voltage', models.FloatField()),
                ('amperage', models.FloatField()),
                ('measurement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appnoise.Measurement')),
            ],
        ),
        migrations.CreateModel(
            name='MeasurementResult',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('average', models.FloatField()),
                ('rms', models.FloatField()),
                ('si', models.FloatField()),
                ('li', models.FloatField()),
                ('sv', models.FloatField()),
                ('rn', models.FloatField()),
                ('icorr', models.FloatField()),
                ('mpy', models.FloatField()),
                ('measurement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appnoise.Measurement')),
            ],
        ),
    ]
