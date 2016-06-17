/**
 * Created by ahmad on 5/16/2016.
 */
(function () {
    "use strict";

    define(['toastr'], function (toastr) {
        function measurementResultController($location, measurementService,
                                             mathService, dateTimeService, diagramsService,
                                             measurementResultService, pointService) {

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
                filters: false,
                details: false
            };
            vm.selectedRow = {};


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
            vm.setAsMainResult = setAsMainResult;
            vm.viewDetails = viewDetails;
            vm.viewFilters = viewFilters;
            vm.hasValue = hasValue;

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
                        if (vm.measurement) {
                            // Get point title
                            pointService.get(vm.measurement.point)
                                .success(function (data) {
                                    vm.point = data;
                                    // Set view title
                                    angular.element("#viewTitle").html("نتایج اندازه گیری " +
                                        dateTimeService.formatToDateTime(vm.measurement.measurement_date) +
                                        " در نقطه " + vm.point.title);
                                })
                                .error(function (data) {
                                    toastr.error("خطا در دریافت اطلاعات نقطه");
                                })
                        }
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

            function getFilteredData(row, filterCol) {
                debugger;
                var tempData = angular.copy(vm.measurementRecords);
                var filteredData = [];

                // Apply filter
                if (!isNaN(parseFloat(row[filterCol + "FilterMin"]))) {
                    for (var i = 0; i < tempData.length; i++) {
                        if (tempData[i][filterCol] <= row[filterCol + "FilterMax"] &&
                            tempData[i][filterCol] >= row[filterCol + "FilterMin"]) {
                            filteredData.push(tempData[i]);
                        }
                    }
                } else {
                    filteredData = tempData;
                }

                debugger;

                // Apply voltage MAR
                if (!isNaN(parseFloat(row[filterCol + "MovingAverage"]))) {
                    filteredData = removeMovingAverage(filteredData, row[filterCol + "MovingAverage"], filterCol);
                }

                debugger;

                return filteredData;
            }

            function removeMovingAverage(noiseArray, range, columnName) {
                var filteredArray = [];
                // Calc boundaries
                var low = range;
                var high = (noiseArray.length - 1) - (range + 1);
                var sum;
                var tempAvg;
                var tempNoiseObj;

                for (var i = low; i <= high; i++) {
                    sum = 0;
                    for (var j = i - range; j <= (i + range + 1); j++) {
                        sum += noiseArray[j][columnName];
                    }
                    tempAvg = sum / (2 * range + 1);
                    tempNoiseObj = angular.copy(noiseArray[i]);
                    tempNoiseObj[columnName] = tempNoiseObj[columnName] - tempAvg;
                    filteredArray.push(tempNoiseObj);
                }

                return filteredArray;
            }

            function showVoltageDiagram(row) {
                // Prepare data for diagrams
                vm.voltageData = vm.getDataForDiagram(getFilteredData(row, "voltage"), "voltage", "Voltage Wave", "#2ca02c");
                // Go to voltage view
                vm.setView("voltage");
                // Set selected row to this row
                vm.selectRow(row);
            }

            function showAmperageDiagram(row) {
                vm.amperageData = vm.getDataForDiagram(getFilteredData(row, "amperage"), "amperage", "Amperage Wave", "#2ca02c");
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
                vm.selectedRow = row;
            }

            function hasFilter(row) {
                return (!isNaN(parseFloat(row.amperageFilterMin)) && !isNaN(parseFloat(row.amperageFilterMax))) ||
                    (!isNaN(parseFloat(row.voltageFilterMin)) && !isNaN(parseFloat(row.voltageFilterMax)))
                    || !isNaN(parseFloat(row.voltageMovingAverage)) || !isNaN(parseFloat(row.amperageMovingAverage));
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

            function setAsMainResult(row) {
                return measurementResultService.setAsMainResult(row.id)
                    .success(function (data, status) {
                        toastr.success("نتیجه اصلی با موفقیت تغییر یافت");
                        // Reload results
                        vm.getMeasurementResults(vm.getMeasurementId());
                    })
                    .error(function (data, status) {
                        toastr.error("خطا در تغییر نتیجه اصلی");
                    });
            }

            function viewDetails(row) {
                // Go to details view
                vm.setView("details");
                // Set selected row to this row
                vm.selectRow(row);
            }

            function viewFilters(row) {
                // Go to details view
                vm.setView("filters");
                // Set selected row to this row
                vm.selectRow(row);
            }

            function hasValue(property) {
                return !isNaN(parseFloat(property));
            }
        }

        measurementResultController.$inject = ["$location", "measurementService",
            "mathService", "dateTimeService", "diagramsService", "measurementResultService", "pointService"];
        return measurementResultController;
    });

})();
