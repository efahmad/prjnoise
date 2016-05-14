(function () {
    "use strict";

    function measurementController(measurementService, dateTimeService) {

        var vm = this;
        vm.header = "نتایج پیشین";
        vm.dateTimeService = dateTimeService;
        vm.activeTab = 1;
        vm.measurements = [];
        vm.noises = [];
        // Calculations results
        vm.results = {};
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
                    // tickFormat: function (d) {
                    // return d3.format('.03f')(d);
                    // },
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
        vm.voltageFilterMin = undefined;
        vm.voltageFilterMax = undefined;
        vm.amperageFilterMin = undefined;
        vm.amperageFilterMax = undefined;
        vm.isVoltageFiltered = false;
        vm.isAmperageFiltered = false;

        //==== Function Definitions ====//
        vm.getMeasurements = getMeasurements;
        vm.setActiveTab = setActiveTab;
        vm.onMeasurementSelected = onMeasurementSelected;
        vm.getDataForDiagram = getDataForDiagram;
        vm.calcResults = calcResults;
        vm.applyFilters = applyFilters;
        vm.resetFilter = resetFilter;
        vm.clearForm = clearForm;
        vm.start = start;

        // Start the app
        vm.start();

        //==== Function Implementations ====//
        function start() {

            // Set view title
            angular.element("#viewTitle").html("فایل های ذخیره شده");

            vm.getMeasurements();

            vm.voltageOptions = angular.copy(vm.options);
            vm.amperageOptions = angular.copy(vm.options);

            vm.voltageOptions.chart.yAxis.axisLabel = 'Voltage (v)';
            vm.voltageOptions.title.text = "نمودار نوسانات ولتاژ بر حسب زمان";

            vm.amperageOptions.chart.yAxis.axisLabel = "Amperage (A)";
            vm.amperageOptions.title.text = "نمودار نوسانات شدت جریات بر حسب زمان";
        }

        function getMeasurements() {
            return measurementService.getAll().success(function (data, status) {
                vm.measurements = data;
                for (var i = 0; i < vm.measurements.length; i++) {
                    vm.measurements[i].rowNum = i + 1;
                }
            }).error(function (data, status) {
                toastr.error("خطا در دریافت لیست فایل ها");
            });
        }

        function setActiveTab(tabNumber) {
            vm.activeTab = tabNumber;
        }

        function onMeasurementSelected(id) {
            // Clear form
            vm.clearForm();

            // Get records of measurement
            measurementService.getRecords(id).success(function (data, status) {
                vm.noises = data;
                for (var i = 0; i < vm.noises.length; i++) {
                    vm.noises[i].rowNum = i + 1;
                }

                // Calculate results
                vm.results = vm.calcResults(vm.noises);

                // Prepare data for diagrams
                vm.voltageData = vm.getDataForDiagram(vm.noises, "voltage", "Voltage Wave", "#2ca02c");
                vm.amperageData = vm.getDataForDiagram(vm.noises, "amperage", "Amperage Wave", "#2ca02c");


            }).error(function (data, status) {
                toastr.error("خطا در دریافت رکورد های فایل");
            });
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

        function calcResults(noisesData) {
            var amperageSquareSum = 0,
                amperageArray = [],
                voltageArray = [],
                tempResult = {};

            for (var i = 0; i < noisesData.length; i++) {
                amperageArray.push(noisesData[i].amperage);
                voltageArray.push(noisesData[i].voltage);

                amperageSquareSum += Math.pow(noisesData[i].amperage, 2);
            }

            tempResult.average = amperageSquareSum / noisesData.length;
            tempResult.rms = Math.sqrt(tempResult.average);
            tempResult.si = math.std(amperageArray);
            tempResult.li = tempResult.si / tempResult.rms;
            tempResult.sv = math.std(voltageArray);
            tempResult.rn = tempResult.sv / tempResult.si;
            tempResult.icorr = 0.026 / tempResult.rn;
            // Convert & Round icorr to 3 decimal places
            var temp = tempResult.icorr * Math.pow(10, 6);
            temp = Math.floor(temp * 1000) / 1000;
            temp = Math.ceil(temp * 1000) / 1000;
            tempResult.mpy = 0.128 * temp * 55.8 / 2 / 7.8;
            return tempResult;
        }

        function applyFilters(filterMin, filterMax, filterAttr) {
            var filterMin = parseFloat(filterMin),
                filterMax = parseFloat(filterMax),
                filteredNoises = [];

            if (isNaN(filterMin) || isNaN(filterMax)) {
                toastr.error("مقدار فیلتر نامعتبر است");
                return;
            }

            if (filterAttr === "voltage")
                vm.isVoltageFiltered = true;
            if (filterAttr === "amperage")
                vm.isAmperageFiltered = true;

            for (var i = 0; i < vm.noises.length; i++) {
                if (vm.noises[i][filterAttr] <= filterMax && vm.noises[i][filterAttr] >= filterMin) {
                    filteredNoises.push(vm.noises[i]);
                }
            }

            vm.results = vm.calcResults(filteredNoises);

            // Prepare data for diagrams
            vm.voltageData = vm.getDataForDiagram(filteredNoises, "voltage", "Voltage Wave", "#2ca02c");
            vm.amperageData = vm.getDataForDiagram(filteredNoises, "amperage", "Amperage Wave", "#2ca02c");
            // show save button
            vm.showSaveButton = true;
        }

        function resetFilter(filterAttr) {
            if (filterAttr === "voltage") {
                vm.isVoltageFiltered = false;
                vm.voltageFilterMin = undefined;
                vm.voltageFilterMax = undefined;

                if (vm.amperageFilterMin !== undefined && vm.amperageFilterMax !== undefined) {
                    vm.applyFilters(vm.amperageFilterMin, vm.amperageFilterMax, "amperage");
                } else {
                    // Calculate results
                    vm.results = vm.calcResults(vm.noises);
                    // Prepare data for diagrams
                    vm.voltageData = vm.getDataForDiagram(vm.noises, "voltage", "Voltage Wave", "#2ca02c");
                    vm.amperageData = vm.getDataForDiagram(vm.noises, "amperage", "Amperage Wave", "#2ca02c");
                }
            }
            if (filterAttr === "amperage") {
                vm.isAmperageFiltered = false;
                vm.amperageFilterMin = undefined;
                vm.amperageFilterMax = undefined;

                if (vm.voltageFilterMin !== undefined && vm.voltageFilterMax !== undefined) {
                    vm.applyFilters(vm.voltageFilterMin, vm.voltageFilterMax, "voltage");
                } else {
                    // Calculate results
                    vm.results = vm.calcResults(vm.noises);
                    // Prepare data for diagrams
                    vm.voltageData = vm.getDataForDiagram(vm.noises, "voltage", "Voltage Wave", "#2ca02c");
                    vm.amperageData = vm.getDataForDiagram(vm.noises, "amperage", "Amperage Wave", "#2ca02c");
                }
            }
        }

        function clearForm() {
            vm.isVoltageFiltered = false;
            vm.voltageFilterMin = undefined;
            vm.voltageFilterMax = undefined;
            vm.isAmperageFiltered = false;
            vm.amperageFilterMin = undefined;
            vm.amperageFilterMax = undefined;
        }
    }

    angular.module("noiseApp").controller("measurementController", measurementController);
    measurementController.$inject = ["measurementService", "dateTimeService"];

})();