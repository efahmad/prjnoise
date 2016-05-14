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
        print("in post method of MeasurementResultList class")
        serializer = MeasurementResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
