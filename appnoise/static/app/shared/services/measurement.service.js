/**
 *
 */
(function() {

    function measurementService($http) {
        var service = {
            add: add,
            getAll: getAll,
            getRecords: getRecords,
            getResults: getResults
        };
        return service;

        function add(measurement) {
            return $http({
                url: "/measurements/",
                method: "POST",
                data: measurement
            });
        }

        function getAll() {
            return $http({
                url: "/measurements/",
                method: "GET"
            });
        }

        function getRecords(id) {
            return $http({
                url: "/measurements/" + id + "/measurementRecords/",
                method: "GET"
            });
        }

        function getResults(id) {
            return $http({
                url: "/measurements/" + id + "/measurementResults/",
                method: "GET"
            });
        }
    }

    angular.module("noiseApp").factory("measurementService", measurementService);
    measurementService.$inject = ["$http"];
})();