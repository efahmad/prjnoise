from django.db import models


# Create your models here.

class Measurement(models.Model):
    title = models.CharField(max_length=50)
    measurement_date = models.DateTimeField()

    def __str__(self):
        return self.title


class MeasurementRecord(models.Model):
    measurement = models.ForeignKey(Measurement, on_delete=models.CASCADE)
    time = models.FloatField()
    temperature = models.FloatField()
    voltage = models.FloatField()
    amperage = models.FloatField()

    def __str__(self):
        return self.measurement.title + "__" + self.time


class MeasurementResult(models.Model):
    measurement = models.ForeignKey(Measurement, on_delete=models.CASCADE)
    average = models.FloatField()
    rms = models.FloatField()
    si = models.FloatField()
    li = models.FloatField()
    sv = models.FloatField()
    rn = models.FloatField()
    icorr = models.FloatField()
    mpy = models.FloatField()
    voltageFilterMin = models.FloatField(null=True)
    voltageFilterMax = models.FloatField(null=True)
    amperageFilterMin = models.FloatField(null=True)
    amperageFilterMax=models.FloatField(null=True)
    isMainResult = models.BooleanField(default=False)

    def __str__(self):
        return self.measurement.title + "__Result"
