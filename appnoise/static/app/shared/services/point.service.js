/**
 * Created by ahmad on 6/3/2016.
 */
(function () {
    "use strict";

    define([], function () {
        function pointService($http) {
            var service = {
                getAll: getAll,
                add: add
            };
            return service;

            function getAll() {
                return $http({
                    url: "/points/",
                    method: "GET"
                });
            }

            function add(title, description) {
                return $http({
                    url: "/points/",
                    method: "POST",
                    data: {
                        title: title,
                        description: description
                    }
                });
            }
        }

        pointService.$inject = ["$http"];
        return pointService;
    });

})();
