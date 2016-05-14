from rest_framework.serializers import ModelSerializer
from rest_framework_bulk import BulkSerializerMixin

from appnoise.models import Measurement, MeasurementRecord, MeasurementResult


class MeasurementSerializer(ModelSerializer):
    class Meta:
        model = Measurement
        fields = ('id', 'title', 'measurement_date')


class MeasurementRecordSerializer(ModelSerializer):
    class Meta:
        model = MeasurementRecord
        fields = ('id', 'measurement', 'time', 'temperature', 'voltage', 'amperage')


class MeasurementResultSerializer(ModelSerializer):
    class Meta:
        model = MeasurementResult
        fields = ('id', 'measurement', 'average', 'rms', 'si', 'li', 'sv', 'rn', 'icorr', 'mpy')
