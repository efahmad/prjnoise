/**
 * Created by ahmad on 5/30/2016.
 */
(function () {

    "use strict";

    function reportController($location, measurementResultService, diagramsService, mathService) {

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
        vm.diagramOptions = {};
        vm.diagramData = [];

        //==== Function Definitions ====
        vm.start = start;
        vm.fromDate.openPopup = function () {
            vm.fromDate.popupOpened = true;
        };
        vm.toDate.openPopup = function () {
            vm.toDate.popupOpened = true;
        };
        vm.search = search;
        vm.getReportParam = getReportParam;


        // Start the app
        vm.start();


        //==== Function Implementations ====
        function start() {
            // Set view title
            angular.element("#viewTitle").html("گزارش " + vm.getReportParam());
            // Set dates
            var now = new Date();
            vm.fromDate.date = new Date((new Date()).setMonth(now.getMonth() - 1));
            vm.toDate.date = now;

            // Get options of diagrams
            vm.diagramOptions = diagramsService.getDefaultOptions();
            vm.diagramOptions.chart.xAxis.axisLabel = "Time (hour)"
            if (vm.getReportParam() == "li") {
                vm.diagramOptions.chart.yAxis.axisLabel = 'Li';
                vm.diagramOptions.title.text = "";
            } else if (vm.getReportParam() == "rn") {
                vm.diagramOptions.chart.yAxis.axisLabel = 'Rn';
                vm.diagramOptions.title.text = "";
            } else {
                vm.diagramOptions.chart.yAxis.axisLabel = 'Mpy';
                vm.diagramOptions.title.text = "";
            }
        }

        function search() {
            return measurementResultService.getReportData(vm.fromDate.date.getTime(), vm.toDate.date.getTime())
                .success(function (data, status) {
                    vm.measurementResults = data;
                    // Convert dates to milliseconds
                    if (vm.measurementResults.length > 0) {
                        var baseTime = (new Date(vm.measurementResults[0].measurement__measurement_date)).getTime();
                        for (var i = 0; i < vm.measurementResults.length; i++) {
                            // Calc milliseconds from base time
                            vm.measurementResults[i].time =
                                (new Date(vm.measurementResults[i].measurement__measurement_date)).getTime() - baseTime;
                            // Convert milliseconds to hours
                            vm.measurementResults[i].time = vm.measurementResults[i].time / (3600 * 1000);
                            // Round the time to one place
                            vm.measurementResults[i].time = mathService.round(vm.measurementResults[i].time, 1);
                        }
                    }

                    // Get diagram data
                    var param = "";
                    if (vm.getReportParam() == "li") {
                        vm.diagramData = diagramsService.getDataForDiagram(
                            vm.measurementResults, "li", "Li Wave", "#2ca02c");
                    } else if (vm.getReportParam() == "rn") {
                        vm.diagramData = diagramsService.getDataForDiagram(
                            vm.measurementResults, "rn", "Rn Wave", "#2ca02c");
                    } else {
                        vm.diagramData = diagramsService.getDataForDiagram(
                            vm.measurementResults, "mpy", "Mpy Wave", "#2ca02c");
                    }
                })
                .error(function (data, status) {
                    toastr.error("خطا در جستجوی داده ها");
                });
        }

        function getReportParam() {
            return $location.search().report_param;
        }
    }

    angular.module("noiseApp").controller("reportController", reportController);
    reportController.$inject = ["$location", "measurementResultService", "diagramsService",
        "mathService"];
})();