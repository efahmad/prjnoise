/**
 * Created by ahmad on 5/16/2016.
 */
(function () {
    "use strict";

    function measurementResultController($location, measurementService,
                                         mathService, dateTimeService, diagramsService,
                                         measurementResultService) {

        //==== variables ====
        var vm = this;
        vm.measurement = undefined;
        vm.measurementRecords = [];
        vm.measurementResults = [];
        // Options specific for voltage diagram
        vm.voltageOptions = {};
        // Options specific for amperage diagram
        vm.amperageOptions = {};
        // Data for voltage diagram
        vm.voltageData = [];
        // Data for amperage diagram
        vm.amperageData = [];
        vm.view = {
            voltage: false,
            amperage: false,
            filters: false
        };
        vm.selectedRowId = -1;


        //==== function definitions ====
        vm.start = start;
        vm.getMeasurementId = getMeasurementId;
        vm.getMeasurement = getMeasurement;
        vm.getMeasurementRecords = getMeasurementRecords;
        vm.getMeasurementResults = getMeasurementResults;
        vm.round = round;
        vm.getDataForDiagram = getDataForDiagram;
        vm.showVoltageDiagram = showVoltageDiagram;
        vm.showAmperageDiagram = showAmperageDiagram;
        vm.setView = setView;
        vm.selectRow = selectRow;
        vm.hasFilter = hasFilter;
        vm.addNewFilter = addNewFilter;
        vm.removeResult = removeResult;

        // Start the app
        vm.start();


        //==== function implementations ====
        function start() {
            if (isNaN(vm.getMeasurementId())) {
                // There is no measurement id, so return to the measurements view
                $location.path('/measurements').search("");
                return;
            }

            // Retrieve measurement by id
            vm.getMeasurement(vm.getMeasurementId())
                .success(function (data, status) {
                    vm.measurement = data;
                    // Set view title
                    angular.element("#viewTitle").html("نتایج اندازه گیری " +
                        dateTimeService.toTehranTimeZone(vm.measurement.measurement_date));
                });


            // Retrieve measurement records
            vm.getMeasurementRecords(vm.getMeasurementId()).then(function (response) {
                vm.measurementRecords = response.data;
            });

            // Retrieve measurement results
            vm.getMeasurementResults(vm.getMeasurementId());

            // Get options of voltage and amperage diagrams
            vm.voltageOptions = diagramsService.getVoltageOptions();
            vm.amperageOptions = diagramsService.getAmperageOptions();
        }

        function getMeasurementId() {
            return parseInt($location.search().measurement_id);
        }

        function getMeasurement(id) {
            return measurementService.get(id)
                .error(function (data, status) {
                    toastr.error("خطا در دریافت خصوصیات اندازه گیری");
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
                .success(function (data, status) {
                    // Add row number
                    for (var i = 0; i < data.length; i++) {
                        data[i].rowNum = i + 1;
                    }
                    vm.measurementResults = data;
                })
                .error(function () {
                    toastr.error("خطا در دریافت نتایج اندازه گیری");
                });
        }

        function round(number) {
            return mathService.to_exponential_3(number);
        }

        function getDataForDiagram(noisesData, columnName, key, color) {
            var temp = [],
                i;

            for (i = 0; i < noisesData.length; i++) {
                temp.push({
                    x: noisesData[i].time,
                    y: noisesData[i][columnName]
                });
            }

            // Line chart data should be sent as an array of series objects.
            return [{
                values: temp,
                key: key,
                color: color
            }];
        }

        function showVoltageDiagram(row) {
            // Prepare data for diagrams
            vm.voltageData = vm.getDataForDiagram(vm.measurementRecords, "voltage", "Voltage Wave", "#2ca02c");
            // Go to voltage view
            vm.setView("voltage");
            // Set selected row to this row
            vm.selectRow(row);
        }

        function showAmperageDiagram(row) {
            vm.amperageData = vm.getDataForDiagram(vm.measurementRecords, "amperage", "Amperage Wave", "#2ca02c");
            // Go to voltage view
            vm.setView("amperage");
            // Set selected row to this row
            vm.selectRow(row);
        }

        function setView(viewType) {
            for (var vType in vm.view) {
                if (vm.view.hasOwnProperty(vType)) {
                    vm.view[vType] = false;
                }
            }
            //
            vm.view[viewType] = true;
        }

        function selectRow(row) {
            vm.selectedRowId = row.id;
        }

        function hasFilter(row) {
            return (!isNaN(parseFloat(row.amperageFilterMin)) && !isNaN(parseFloat(row.amperageFilterMax))) ||
                (!isNaN(parseFloat(row.voltageFilterMin)) && !isNaN(parseFloat(row.voltageFilterMax)));

        }

        function addNewFilter() {
            $location.path('/measurementResults/addFilter');
        }

        function removeResult(row) {
            // If the measurement result is main result, we can not delete it
            if (row.isMainResult) {
                toastr.warning("نتیجه اصلی قابل حذف نمی باشد");
                return;
            }

            return measurementResultService.remove(row.id)
                .success(function (data, status) {
                    toastr.success("نتیجه مورد نظر با موفقیت حذف شد");
                    // Reload results
                    vm.getMeasurementResults(vm.getMeasurementId());
                })
                .error(function (data, status) {
                    toastr.error("خطا در حذف نتیجه");
                });
        }
    }

    angular.module("noiseApp").controller("measurementResultController", measurementResultController);
    measurementResultController.$inject = ["$location", "measurementService",
        "mathService", "dateTimeService", "diagramsService", "measurementResultService"];
})();
