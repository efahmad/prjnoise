from datetime import datetime

from django.http import Http404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from appnoise.models import MeasurementResult
from appnoise.serializers import MeasurementResultSerializer


def get_object(pk):
    try:
        return MeasurementResult.objects.get(pk=pk)
    except MeasurementResult.DoesNotExist:
        raise Http404


# /measurementResults
class MeasurementResultList(APIView):
    """List all MeasurementResults or create a new one"""

    # GET /measurementResults
    def get(self, request, format=None):
        measurement_results = MeasurementResult.objects.all()
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

    # GET /measurementResults/5/
    def get(self, request, pk, format=None):
        measurement_result = get_object(pk)
        serializer = MeasurementResultSerializer(measurement_result)
        return Response(serializer.data)

    # PUT /measurementResults/5/
    def put(self, request, pk, format=None):
        measurement_result = get_object(pk)
        serializer = MeasurementResultSerializer(measurement_result, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE /measurementResults/5/
    def delete(self, request, pk, format=None):
        measurement_result = get_object(pk)
        measurement_result.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# /measurementResults/5/isMain/
@api_view(['PUT'])
def set_main_result(request, pk):
    """
    Sets the measurement result as the main result by it's primary key
    :param request: The http request object
    :param pk: Primary key of the measurement result
    :return: Response object
    """
    if request.method == 'PUT':
        measurement_result = get_object(pk)
        measurement_id = measurement_result.measurement
        # First set all results as non main
        results = MeasurementResult.objects.filter(measurement=measurement_id)
        for mr in results:
            mr.isMainResult = False
            mr.save()
        # Set this result as main result
        measurement_result.isMainResult = True
        measurement_result.save()
        serializer = MeasurementResultSerializer(measurement_result)
        return Response(serializer.data)


# /measurementResults/report/
@api_view(['GET'])
def get_report_data(request):
    """
    Gets the report data
    :param request: The http request object
    :return: Response object
    """
    if request.method == 'GET':
        start_date_milli = int(request.query_params["start_date"])
        end_date_milli = int(request.query_params["end_date"])

        start_date = datetime.fromtimestamp(start_date_milli / 1000.0).date()
        end_date = datetime.fromtimestamp(end_date_milli / 1000.0).date()

        results = MeasurementResult.objects.filter(
            measurement__measurement_date__range=(start_date, end_date),
            isMainResult=True).values('id',
                                      'li',
                                      'rn',
                                      'mpy',
                                      'measurement__measurement_date')
        # serializer = MeasurementResultSerializer(results, many=True)
        # return Response(serializer.data)
        return Response(data=results)
