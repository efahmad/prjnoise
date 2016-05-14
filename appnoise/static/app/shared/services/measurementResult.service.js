(function() {
    "use strict";

    function measurementResultService($http) {
        var service = {
            add: add
        };
        return service;

        function add(measurementResult) {
            return $http({
                url: "/measurementResults/",
                method: "POST",
                data: measurementResult
            });
        }
    };

    angular.module("noiseApp").factory("measurementResultService", measurementResultService);
    measurementResultService.$inject = ["$http"];
})();