from django.conf.urls import url

from appnoise.views import home, measurements, measurement_results, measurement_records

urlpatterns = [
    url(r'^$', home.index, name='index'),
    url(r'^measurements/$', measurements.MeasurementList.as_view()),
    url(r'^measurements/(?P<pk>[0-9]+)/measurementRecords/$',
        measurements.MeasurementMeasurementRecordDetails.as_view()),
    url(r'^measurements/(?P<pk>[0-9]+)/measurementResults/$',
        measurements.MeasurementMeasurementResultDetails.as_view()),
    url(r'^measurementResults/$', measurement_results.MeasurementResultList.as_view()),
    url(r'^measurementRecords/many/$', measurement_records.MeasurementRecordBulkView.as_view()),
]
