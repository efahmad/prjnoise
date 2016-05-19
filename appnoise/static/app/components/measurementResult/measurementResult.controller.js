/**
 * Created by ahmad on 5/16/2016.
 */
(function () {
    "use strict";

    function measurementResultController($location, tempStorageService, measurementService) {

        //==== variables ====
        var vm = this;
        vm.measurement = undefined;
        vm.measurementRecords = [];
        vm.measurementResults = [];


        //==== function definitions ====
        vm.start = start;
        vm.getMeasurementRecords = getMeasurementRecords;
        vm.getMeasurementResults = getMeasurementResults;

        // Start the app
        vm.start();


        //==== function implementations ====
        function start() {

            // Retrieve measurement data
            vm.measurement = tempStorageService.getMeasurement();
            if (!vm.measurement) {
                // There is no measurement data, so return to the measurements view
                $location.path('/measurements');
                return;
            }

            // Set view title
            angular.element("#viewTitle").html("نتایج اندازه گیری " + vm.measurement.title);

            // Retrieve measurement records
            vm.getMeasurementRecords(vm.measurement.id).then(function(response){
               vm.measurementRecords = response.data;
            });

            // Retrieve measurement results
            vm.getMeasurementResults(vm.measurement.id).then(function(response){
                vm.measurementResults = response.data;
            });

        }

        function getMeasurementRecords(measurementId) {
            return measurementService.getRecords(measurementId)
                .error(function () {
                    toastr.error("خطا در دریافت داده های اندازه گیری");
                });
        }

        function getMeasurementResults(measurementId) {
            return measurementService.getResults(measurementId)
                .error(function () {
                    toastr.error("خطا در دریافت نتایج اندازه گیری");
                });
        }
    }

    angular.module("noiseApp").controller("measurementResultController", measurementResultController);
    measurementResultController.$inject = ["$location", "tempStorageService", "measurementService"];
})();
