/**
 * Created by ahmad on 5/16/2016.
 */
(function () {
    "use strict";

    function tempStorageService() {

        var service = {
            saveMeasurement: saveMeasurement,
            getMeasurement: getMeasurement,
            saveMeasurementResult: saveMeasurementResult,
            getMeasurementResult: getMeasurementResult,
            saveMeasurementRecordsArray: saveMeasurementRecordsArray,
            getMeasurementRecordsArray: getMeasurementRecordsArray
        };
        return service;

        var measurement = {};
        var measurementResult;
        var measurementRecordsArray;

        function saveMeasurement(data) {
            measurement = data;
        }

        function getMeasurement() {
            return measurement;
        }

        function saveMeasurementResult(data) {
            measurementResult = data;
        }

        function getMeasurementResult() {
            return measurementResult;
        }

        function saveMeasurementRecordsArray(data) {
            measurementRecordsArray = data;
        }

        function getMeasurementRecordsArray() {
            return measurementRecordsArray;
        }

    }

    angular.module("noiseApp").factory("tempStorageService", tempStorageService);
    tempStorageService.$inject = [];
})();
