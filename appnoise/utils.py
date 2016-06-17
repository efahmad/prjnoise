import datetime

from django.utils import timezone


class DateTimeUtils():
    def __init__(self):
        pass

    @staticmethod
    def to_timezone_aware(utc_string):
        # if just_date:
        #     naive_date = datetime.datetime.strptime(utc_string, '%Y-%m-%dT%H:%M:%S.%fZ').date()
        # else:
        naive_date = datetime.datetime.strptime(utc_string, '%Y-%m-%dT%H:%M:%S.%fZ')
        return timezone.make_aware(naive_date, timezone.get_default_timezone())
