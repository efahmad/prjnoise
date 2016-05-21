/**
 * Created by ahmad on 5/16/2016.
 */
(function () {
    "use strict";

    function measurementResultController($location, tempStorageService, measurementService,
                                         mathService, dateTimeService) {

        //==== variables ====
        var vm = this;
        vm.measurement = undefined;
        vm.measurementRecords = [];
        vm.measurementResults = [];
        // Shared options for voltage & amperage diagrams
        vm.options = {
            chart: {
                type: 'lineChart',
                height: 500,
                margin: {
                    top: 50,
                    right: 50,
                    bottom: 75,
                    left: 150
                },
                x: function (d) {
                    return d.x;
                },
                y: function (d) {
                    return d.y;
                },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function (e) {
                        console.log("stateChange");
                    },
                    changeState: function (e) {
                        console.log("changeState");
                    },
                    tooltipShow: function (e) {
                        console.log("tooltipShow");
                    },
                    tooltipHide: function (e) {
                        console.log("tooltipHide");
                    }
                },
                xAxis: {
                    axisLabel: 'Time (s)',
                    axisLabelDistance: 10
                },
                yAxis: {
                    tickFormat: function (d) {
                        // return d3.format('.03f')(d);
                        return vm.round(d);
                    },
                    axisLabelDistance: 50
                },
                /*callback: function(chart) {
                 console.log("!!! lineChart callback !!!");
                 }*/
            },
            title: {
                enable: true
            }
            /*,
             subtitle: {
             enable: true,
             text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
             css: {
             'text-align': 'center',
             'margin': '10px 13px 0px 7px'
             }
             }*/
        };
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
            angular.element("#viewTitle").html("نتایج اندازه گیری " +
                dateTimeService.toTehranTimeZone(vm.measurement.measurement_date));

            // Retrieve measurement records
            vm.getMeasurementRecords(vm.measurement.id).then(function (response) {
                vm.measurementRecords = response.data;
            });

            // Retrieve measurement results
            vm.getMeasurementResults(vm.measurement.id).then(function (response) {
                // Add row number
                for (var i = 0; i < response.data.length; i++) {
                    response.data[i].rowNum = i + 1;
                }
                vm.measurementResults = response.data;
            });

            // Set options of voltage and amperage diagrams
            vm.voltageOptions = angular.copy(vm.options);
            vm.voltageOptions.chart.yAxis.axisLabel = 'Voltage (v)';
            vm.voltageOptions.title.text = "نمودار نوسانات پتانسیل بر حسب زمان";
            //
            vm.amperageOptions = angular.copy(vm.options);
            vm.amperageOptions.chart.yAxis.axisLabel = "Amperage (A)";
            vm.amperageOptions.title.text = "نمودار نوسانات جریان بر حسب زمان";
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
            // Save measurement to temp storage to retrieve it in the target view
            tempStorageService.saveMeasurementRecordsArray(angular.copy(vm.measurementRecords));
            $location.path('/measurementResults/addFilter');
        }
    }

    angular.module("noiseApp").controller("measurementResultController", measurementResultController);
    measurementResultController.$inject = ["$location", "tempStorageService", "measurementService",
        "mathService", "dateTimeService"];
})();
