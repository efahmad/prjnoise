(function() {
    "use strict";

    function measurementRecordService($http) {
        var service = {
            add: add,
            addMany: addMany
        };
        return service;

        function add(measurementRecord) {
            return $http({
                url: "/MeasurementRecords",
                method: "POST",
                data: measurementRecord
            });
        }

        function addMany(measurementRecordArray) {
            return $http({
                url: "/measurementRecords/many/",
                method: "POST",
                data: measurementRecordArray
            });
        }
    }

    angular.module("noiseApp").factory("measurementRecordService", measurementRecordService);
    measurementRecordService.$inject = ["$http"];
})();