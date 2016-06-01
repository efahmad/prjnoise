/**
 * Created by ahmad on 5/30/2016.
 */
(function () {

    "use strict";

    function reportController(measurementResultService) {

        //==== variables ====
        var vm = this;
        vm.fromDate = {
            popupOpened: false
        };
        vm.toDate = {
            popupOpened: false
        };
        vm.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };
        vm.measurementResults = [];

        //==== Function Definitions ====
        vm.start = start;
        vm.fromDate.openPopup = function () {
            vm.fromDate.popupOpened = true;
        };
        vm.toDate.openPopup = function () {
            vm.toDate.popupOpened = true;
        };
        vm.search = search;

        vm.start();


        //==== Function Implementations ====
        function start() {
            // Set view title
            angular.element("#viewTitle").html("گزارش");
            // Set dates
            var now = new Date();
            vm.fromDate.date = new Date((new Date()).setMonth(now.getMonth() - 1));
            vm.toDate.date = now;
        }

        function search() {
            return measurementResultService.getReportData(vm.fromDate.date.getTime(), vm.toDate.date.getTime())
                .success(function (data, status) {
                    
                })
                .error(function (data, status) {
                    toastr.error("خطا در جستجوی داده ها");
                });
        }
    }

    angular.module("noiseApp").controller("reportController", reportController);
    reportController.$inject = ["measurementResultService"];
})();