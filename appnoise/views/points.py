from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from appnoise.models import Point
from appnoise.serializers import PointSerializer


# /points/
class PointList(APIView):
    """Get all points or add a new one"""

    # GET /points/
    def get(self, request, format=None):
        points = Point.objects.all().order_by("id")
        serializer = PointSerializer(points, many=True)
        return Response(data=serializer.data)

    # POST /points/
    def post(self, request, format=None):
        serializer = PointSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# /points/5
class PointDetails(APIView):
    """
    Retrieve, update or delete a Point instance.
    """

    def get_object(self, pk):
        try:
            return Point.objects.get(pk=pk)
        except:
            raise Http404

    # GET /points/5
    def get(self, request, pk, format=None):
        point = self.get_object(pk)
        serializer = PointSerializer(point)
        return Response(serializer.data)

    # PUT /points/5
    def put(self, request, pk, format=None):
        point = self.get_object(pk)
        serializer = PointSerializer(point, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # DELETE /points/5
    def delete(self, request, pk, format=None):
        point = self.get_object(pk)
        point.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
