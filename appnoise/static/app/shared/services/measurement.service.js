/**
 *
 */
(function () {

    define([], function () {
        
        function measurementService($http) {
            var service = {
                add: add,
                get: get,
                getAll: getAll,
                remove: remove,
                getRecords: getRecords,
                getResults: getResults,
                getByPointAndDate: getByPointAndDate
            };
            return service;

            function add(measurement) {
                return $http({
                    url: "/measurements/",
                    method: "POST",
                    data: measurement
                });
            }

            function get(id) {
                return $http({
                    url: "/measurements/" + id + "/",
                    method: "GET"
                });
            }

            function getAll() {
                return $http({
                    url: "/measurements/",
                    method: "GET"
                });
            }

            function remove(id) {
                return $http({
                    url: "/measurements/" + id + "/",
                    method: "DELETE"
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

            function getByPointAndDate(point_id, milliseconds) {
                return $http({
                    url: "/measurements/?point_id=" + point_id + "&measurement_date=" + milliseconds,
                    method: "GET"
                });
            }
        }

        measurementService.$inject = ["$http"];
        return measurementService;
    });

})();