/**
 * Created by ahmad on 6/3/2016.
 */
(function () {
    "use strict";

    define([], function () {
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

        pointService.$inject = ["$http"];
        return pointService;
    });

})();
