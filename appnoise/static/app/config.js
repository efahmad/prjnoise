/**
 *
 */
(function () {
    "use strict";

    define(['toastr'], function (toastr) {

        function config($routeProvider, blockUIConfig, uibDatepickerConfig, uibDatepickerPopupConfig) {

            $routeProvider.when('/', {
                templateUrl: '/static/app/components/home/home.view.html',
                controller: 'homeController as vm'
            }).when("/points", {
                templateUrl: "/static/app/components/point/point.view.html",
                controller: "pointController as vm"
            }).when("/measurements", {
                templateUrl: '/static/app/components/measurement/measurement.view.html',
                controller: 'measurementController as vm'
            }).when('/measurements/add', {
                templateUrl: '/static/app/components/measurement/measurementAdd.view.html',
                controller: 'measurementAddController as vm'
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

            // angular-block-ui config
            // Change the default overlay message
            blockUIConfig.message = 'در حال بارگذاری ...';
            // Change the default delay to 100ms before the blocking is visible
            blockUIConfig.delay = 100;

            // Datepicker configs
            uibDatepickerConfig.showWeeks = false;
            uibDatepickerPopupConfig.toggleWeeksText = null;
            uibDatepickerPopupConfig.showButtonBar = false;
        }

        config.$inject = ["$routeProvider", "blockUIConfig", "uibDatepickerConfig", "uibDatepickerPopupConfig"];
        return config;
    });

})();