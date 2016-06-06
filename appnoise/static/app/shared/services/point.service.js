/**
 * Created by ahmad on 6/3/2016.
 */
(function () {
    "use strict";

    define([], function () {
        function pointService($http) {
            var service = {
                getAll: getAll,
                add: add,
                edit: edit,
                remove: remove
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

            function edit(id, title, description) {
                return $http({
                    url: "/points/" + id + "/",
                    method: "PUT",
                    data: {
                        id: id,
                        title: title,
                        description: description
                    }
                });
            }

            function remove(id) {
                return $http({
                    url: "/points/" + id + "/",
                    method: "delete"
                });
            }
        }

        pointService.$inject = ["$http"];
        return pointService;
    });

})();
