from rest_framework_bulk import ListBulkCreateUpdateDestroyAPIView

from appnoise.models import MeasurementRecord
from appnoise.serializers import MeasurementRecordSerializer


# POST /measurementRecords/many
class MeasurementRecordBulkView(ListBulkCreateUpdateDestroyAPIView):
    queryset = MeasurementRecord.objects.all()
    serializer_class = MeasurementRecordSerializer
