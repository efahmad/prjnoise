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
                }).when("/points", {
                    templateUrl: "/static/app/components/point/point.view.html",
                    controller: "pointController as vm"
                }).when("/measurements", {
                    templateUrl: '/static/app/components/measurement/measurement.view.html',
                    controller: 'measurementController as vm'
                }).when("/measurementResults", {
                    templateUrl: "/static/app/components/measurementResult/measurementResult.view.html",
                    controller: "measurementResultController as vm"
                }).when("/measurementResults/addFilter", {
                    templateUrl: "/static/app/components/measurementResult/addFilter.view.html",
                    controller: "addFilterController as vm"
                }).when("/reports/resultReports", {
                    templateUrl: "/static/app/components/resultReports/report.view.html",
                    controller: "reportController as vm"
                }).otherwise({
                    redirectTo: '/'
                });
                ;
            }
        ]);
})();