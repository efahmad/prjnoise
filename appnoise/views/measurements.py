from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from appnoise.models import Measurement, MeasurementRecord, MeasurementResult
from appnoise.serializers import MeasurementSerializer, MeasurementRecordSerializer, MeasurementResultSerializer


# /measurements
class MeasurementList(APIView):
    """List all Measurements or create a new one"""

    # GET /measurements
    def get(self, request, format=None):
        measurements = Measurement.objects.all()
        serializer = MeasurementSerializer(measurements, many=True)
        return Response(serializer.data)

    # POST /measurements
    def post(self, request, format=None):
        serializer = MeasurementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# /measurement/5/measurementRecords
class MeasurementMeasurementRecordDetails(APIView):
    # GET /measurement/5/measurementRecords
    def get(self, request, pk, format=None):
        measurement_records = MeasurementRecord.objects.filter(measurement=pk).order_by("time")
        serializer = MeasurementRecordSerializer(measurement_records, many=True)
        return Response(serializer.data)


# /measurement/5/measurementResults
class MeasurementMeasurementResultDetails(APIView):
    # GET /measurement/5/measurementResults
    def get(self, request, pk, format=None):
        measurement_results = MeasurementResult.objects.filter(measurement=pk)
        serializer = MeasurementResultSerializer(measurement_results, many=True)
        return Response(serializer.data)
