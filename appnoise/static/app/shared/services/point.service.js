/**
 * Created by ahmad on 6/3/2016.
 */
(function () {
    "use strict";

    function pointService($http) {
        var service = {
            getAll: getAll
        };
        return service;

        function getAll() {
            return $http({
                url: "/points/",
                method: "GET"
            });
        }
    }

    angular.module("noiseApp").factory("pointService", pointService);
    pointService.$inject = ["$http"];

})();
