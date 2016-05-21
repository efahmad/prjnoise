/**
 *
 */
(function () {
    "use strict";

    angular.module("noiseApp")
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.when('/', {
                    templateUrl: '/static/app/components/home/home.view.html',
                    controller: 'homeController as vm'
                }).when("/measurements", {
                    templateUrl: '/static/app/components/measurement/measurement.view.html',
                    controller: 'measurementController as vm'
                }).when("/measurementResults", {
                    templateUrl: "/static/app/components/measurementResult/measurementResult.view.html",
                    controller: "measurementResultController as vm"
                }).when("/measurementResults/addFilter", {
                    templateUrl: "/static/app/components/measurementResult/addFilter.view.html",
                    controller: "addFilterController as vm"
                }).otherwise({
                    redirectTo: '/'
                });
                ;
            }
        ]);
})();