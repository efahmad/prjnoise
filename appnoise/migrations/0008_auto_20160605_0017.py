# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-06-05 00:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appnoise', '0007_auto_20160604_2303'),
    ]

    operations = [
        migrations.AlterField(
            model_name='point',
            name='description',
            field=models.CharField(blank=True, default='', max_length=256),
            preserve_default=False,
        ),
    ]
