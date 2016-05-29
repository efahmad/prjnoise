from django.http import Http404
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
        # Get all measurements and order by measurement_date descending
        measurements = Measurement.objects.all().order_by("-measurement_date")
        serializer = MeasurementSerializer(measurements, many=True)
        return Response(serializer.data)

    # POST /measurements
    def post(self, request, format=None):
        serializer = MeasurementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeasurementDetail(APIView):
    """
    Retrieve, update or delete a Measurement instance.
    """

    def get_object(self, pk):
        try:
            return Measurement.objects.get(pk=pk)
        except Measurement.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        measurement = self.get_object(pk)
        serializer = MeasurementSerializer(measurement)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        measurement = self.get_object(pk)
        serializer = MeasurementSerializer(measurement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        measurement = self.get_object(pk)
        measurement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
        measurement_results = MeasurementResult.objects.filter(measurement=pk).order_by("id")
        serializer = MeasurementResultSerializer(measurement_results, many=True)
        return Response(serializer.data)
