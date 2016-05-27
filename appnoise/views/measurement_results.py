from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from appnoise.models import MeasurementResult
from appnoise.serializers import MeasurementResultSerializer


# /measurementResults
class MeasurementResultList(APIView):
    """List all MeasurementResults or create a new one"""

    # GET /measurementResults
    def get(self, request, format=None):
        measurement_results = MeasurementResult.object.all()
        serializer = MeasurementResultSerializer(measurement_results, many=True)
        return Response(serializer.data)

    # POST /measurementResults
    def post(self, request, format=None):
        serializer = MeasurementResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# /measurementResults/5/
class MeasurementResultDetail(APIView):
    """
    Retrieve, update or delete a MeasurementResult instance.
    """

    def get_object(self, pk):
        try:
            return MeasurementResult.objects.get(pk=pk)
        except MeasurementResult.DoesNotExist:
            raise Http404

    # GET /measurementResults/5/
    def get(self, request, pk, format=None):
        measurement_result = self.get_object(pk)
        serializer = MeasurementResultSerializer(measurement_result)
        return Response(serializer.data)

    # PUT /measurementResults/5/
    def put(self, request, pk, format=None):
        measurement_result = self.get_object(pk)
        serializer = MeasurementResultSerializer(measurement_result, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE /measurementResults/5/
    def delete(self, request, pk, format=None):
        measurement_result = self.get_object(pk)
        measurement_result.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
