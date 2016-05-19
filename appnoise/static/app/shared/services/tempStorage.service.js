/**
 * Created by ahmad on 5/16/2016.
 */
(function () {
    "use strict";

    function tempStorageService() {

        var service = {
            saveMeasurement: saveMeasurement,
            getMeasurement: getMeasurement
        };
        return service;

        var measurement = {};

        function saveMeasurement(data) {
            measurement = data;
        }
        
        function getMeasurement(){
            return measurement;
        }

    }

    angular.module("noiseApp").factory("tempStorageService", tempStorageService);
    tempStorageService.$inject = [];
})();
