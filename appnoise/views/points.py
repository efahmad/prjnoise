from rest_framework.response import Response
from rest_framework.views import APIView


from appnoise.models import Point
from appnoise.serializers import PointSerializer


# /points/
class PointList(APIView):
    """Get all points or add a new one"""

    # GET /points/
    def get(self, request, format=None):
        points = Point.objects.all()
        serializer = PointSerializer(points, many=True)
        return Response(data=serializer.data)

    # POST /points/
    def post(self, request, format=None):
        pass
