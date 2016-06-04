(function () {
    "use strict";

    define([], function () {

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

        measurementRecordService.$inject = ["$http"];
        return measurementRecordService;
        
    });

})();