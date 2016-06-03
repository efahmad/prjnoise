from rest_framework.serializers import ModelSerializer

from appnoise.models import Measurement, MeasurementRecord, MeasurementResult, Point


class PointSerializer(ModelSerializer):
    class Meta:
        model = Point
        fields = ('id', 'title', 'description')


class MeasurementSerializer(ModelSerializer):
    class Meta:
        model = Measurement
        fields = ('id', 'point', 'title', 'measurement_date')


class MeasurementRecordSerializer(ModelSerializer):
    class Meta:
        model = MeasurementRecord
        fields = ('id', 'measurement', 'time', 'temperature', 'voltage', 'amperage')


class MeasurementResultSerializer(ModelSerializer):
    class Meta:
        model = MeasurementResult
        fields = ('id', 'measurement', 'average', 'rms', 'si', 'li', 'sv', 'rn', 'icorr', 'mpy',
                  'amperageFilterMin', 'amperageFilterMax', 'amperageMovingAverage',
                  'voltageFilterMin', 'voltageFilterMax', 'voltageMovingAverage', 'isMainResult')
