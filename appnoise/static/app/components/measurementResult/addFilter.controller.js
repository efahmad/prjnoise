/**
 * Created by ahmad on 5/20/2016.
 */
(function () {
    "use strict";

    function addFilterController($location, tempStorageService, diagramsService,
                                 measurementResultService, mathService) {

        //==== Variables ====
        var vm = this;
        vm.measurementRecords = [];
        // Options specific for voltage diagram
        vm.voltageOptions = {};
        // Options specific for amperage diagram
        vm.amperageOptions = {};
        // Data for voltage diagram
        vm.voltageData = [];
        // Data for amperage diagram
        vm.amperageData = [];
        // Voltage filters
        vm.voltageFilterMin = "";
        vm.voltageFilterMax = "";
        vm.voltageMAR = "";
        vm.isVoltageFilterApplied = false;
        vm.isVoltageMARApplied = false;
        // Amperage filters
        vm.amperageFilterMin = "";
        vm.amperageFilterMax = "";
        vm.amperageMAR = "";
        vm.isAmperageFilterApplied = false;
        vm.isAmperageMARApplied = false;
        // Measurement records after applying filter to them
        // which are used to draw diagrams and calc results
        vm.filteredVoltageRecords = undefined;
        vm.filteredAmperageRecords = undefined;
        //
        vm.results = undefined;


        //==== Function definitions ====
        vm.start = start;
        vm.applyVoltageFilter = applyVoltageFilter;
        vm.applyVoltageMAR = applyVoltageMAR;
        vm.applyAmperageFilter = applyAmperageFilter;
        vm.applyAmperageMAR = applyAmperageMAR;
        vm.validateFilters = validateFilters;
        vm.removeVoltageFilter = removeVoltageFilter;
        vm.removeVoltageMAR = removeVoltageMAR;
        vm.removeAmperageFilter = removeAmperageFilter;
        vm.removeAmperageMAR = removeAmperageMAR;
        vm.round = round;

        // Start the app
        vm.start();


        //==== Function implementations ====
        function start() {
            // Retrieve measurement records
            vm.measurementRecords = tempStorageService.getMeasurementRecordsArray();
            if (!vm.measurementRecords) {
                // There is no measurement record data, so return to the measurements view
                $location.path('/measurements');
                return;
            }

            // Set view title
            angular.element("#viewTitle").html("افزودن فیلتر");

            // Get options of voltage and amperage diagrams
            vm.voltageOptions = diagramsService.getVoltageOptions();
            vm.voltageOptions.chart.height = 300;
            vm.amperageOptions = diagramsService.getAmperageOptions();
            vm.amperageOptions.chart.height = 300;
            // Get diagrams data
            vm.voltageData = diagramsService.getVoltageData(vm.measurementRecords);
            vm.amperageData = diagramsService.getAmperageData(vm.measurementRecords);

            // Get filter-free results
            vm.results = measurementResultService.calcAndGetResults(vm.measurementRecords);
        }

        function applyVoltageFilter() {
            var filterMin = parseFloat(vm.voltageFilterMin),
                filterMax = parseFloat(vm.voltageFilterMax),
                noiseDataArray;

            // Check validations
            if (!vm.validateFilters(filterMin, filterMax)) {
                return;
            }

            vm.isVoltageFilterApplied = true;

            noiseDataArray = vm.isVoltageMARApplied
                ? angular.copy(vm.filteredVoltageRecords)
                : angular.copy(vm.measurementRecords);
            vm.filteredVoltageRecords = [];

            // Apply voltage filters
            for (var i = 0; i < noiseDataArray.length; i++) {
                if (noiseDataArray[i]["voltage"] <= filterMax &&
                    noiseDataArray[i]["voltage"] >= filterMin) {
                    vm.filteredVoltageRecords.push(noiseDataArray[i]);
                }
            }

            // Get diagrams data
            vm.voltageData = diagramsService.getVoltageData(vm.filteredVoltageRecords);

            // Get filtered results
            vm.results = measurementResultService.calcAndGetResults(
                vm.filteredAmperageRecords
                    ? vm.filteredAmperageRecords
                    : vm.measurementRecords,
                vm.filteredVoltageRecords);
        }

        function applyVoltageMAR() {
            var voltageMARNum = parseFloat(vm.voltageMAR),
                noiseDataArray;

            // Check validations
            if (isNaN(voltageMARNum)) {
                toastr.error("مقدار وارد شده نامعتبر است");
                return;
            }

            vm.isVoltageMARApplied = true;

            noiseDataArray = vm.isVoltageFilterApplied
                ? angular.copy(vm.filteredVoltageRecords)
                : angular.copy(vm.measurementRecords);
            vm.filteredVoltageRecords = [];

            // Apply voltage MAR
            vm.filteredVoltageRecords = removeMovingAverage(noiseDataArray, voltageMARNum, "voltage");

            // Get diagrams data
            vm.voltageData = diagramsService.getVoltageData(vm.filteredVoltageRecords);

            // Get filtered results
            vm.results = measurementResultService.calcAndGetResults(
                vm.filteredAmperageRecords
                    ? vm.filteredAmperageRecords
                    : vm.measurementRecords,
                vm.filteredVoltageRecords);
        }

        function removeVoltageFilter() {
            /*vm.voltageFilterMin = "";
            vm.voltageFilterMax = "";*/
            vm.isVoltageFilterApplied = false;
            if (vm.isVoltageMARApplied) {
                vm.applyVoltageMAR();
            } else {
                vm.filteredVoltageRecords = undefined;
                // Get diagrams data
                vm.voltageData = diagramsService.getVoltageData(vm.measurementRecords);
                // Get filtered results
                vm.results = measurementResultService.calcAndGetResults(
                    vm.filteredAmperageRecords
                        ? vm.filteredAmperageRecords
                        : vm.measurementRecords,
                    vm.measurementRecords);
            }
        }

        function removeVoltageMAR() {
            /*vm.voltageMAR = "";*/
            vm.isVoltageMARApplied = false;
            if (vm.isVoltageFilterApplied) {
                vm.applyVoltageFilter();
            } else {
                vm.filteredVoltageRecords = undefined;
                // Get diagrams data
                vm.voltageData = diagramsService.getVoltageData(vm.measurementRecords);
                // Get filtered results
                vm.results = measurementResultService.calcAndGetResults(
                    vm.filteredAmperageRecords
                        ? vm.filteredAmperageRecords
                        : vm.measurementRecords,
                    vm.measurementRecords);
            }
        }


        function applyAmperageFilter() {
            var filterMin = parseFloat(vm.amperageFilterMin),
                filterMax = parseFloat(vm.amperageFilterMax),
                noiseDataArray;

            // Check validations
            if (!vm.validateFilters(filterMin, filterMax)) {
                return;
            }

            vm.isAmperageFilterApplied = true;

            noiseDataArray = vm.isAmperageMARApplied
                ? angular.copy(vm.filteredAmperageRecords)
                : angular.copy(vm.measurementRecords);
            vm.filteredAmperageRecords = [];

            // Apply amperage filter
            for (var i = 0; i < noiseDataArray.length; i++) {
                if (noiseDataArray[i]["amperage"] <= filterMax &&
                    noiseDataArray[i]["amperage"] >= filterMin) {
                    vm.filteredAmperageRecords.push(noiseDataArray[i]);
                }
            }

            // Get diagrams data
            vm.amperageData = diagramsService.getAmperageData(vm.filteredAmperageRecords);

            // Get filtered results
            vm.results = measurementResultService.calcAndGetResults(
                vm.filteredAmperageRecords,
                vm.filteredVoltageRecords
                    ? vm.filteredVoltageRecords
                    : vm.measurementRecords);
        }

        function applyAmperageMAR() {
            var amperageMARNum = parseFloat(vm.amperageMAR),
                noiseDataArray;

            // Check validations
            if (isNaN(amperageMARNum)) {
                toastr.error("مقدار وارد شده نامعتبر است");
                return;
            }

            vm.isAmperageMARApplied = true;

            noiseDataArray = vm.isAmperageFilterApplied
                ? angular.copy(vm.filteredAmperageRecords)
                : angular.copy(vm.measurementRecords);
            vm.filteredAmperageRecords = [];

            // Apply voltage MAR
            vm.filteredAmperageRecords = removeMovingAverage(noiseDataArray, amperageMARNum, "amperage");

            // Get diagrams data
            vm.amperageData = diagramsService.getAmperageData(vm.filteredAmperageRecords);

            // Get filtered results
            vm.results = measurementResultService.calcAndGetResults(
                vm.filteredAmperageRecords,
                vm.filteredVoltageRecords
                    ? vm.filteredVoltageRecords
                    : vm.measurementRecords);
        }

        function removeAmperageFilter() {
            /*vm.amperageFilterMin = "";
            vm.amperageFilterMax = "";*/
            vm.isAmperageFilterApplied = false;
            if (vm.isAmperageMARApplied) {
                vm.applyAmperageMAR();
            } else {
                vm.filteredAmperageRecords = undefined;
                // Get diagrams data
                vm.amperageData = diagramsService.getAmperageData(vm.measurementRecords);
                // Get filtered results
                vm.results = measurementResultService.calcAndGetResults(
                    vm.measurementRecords,
                    vm.filteredVoltageRecords
                        ? vm.filteredVoltageRecords
                        : vm.measurementRecords);
            }
        }

        function removeAmperageMAR() {
            /*vm.amperageMAR = "";*/
            vm.isAmperageMARApplied = false;
            if (vm.isAmperageFilterApplied) {
                vm.applyAmperageFilter();
            } else {
                vm.filteredAmperageRecords = undefined;
                // Get diagrams data
                vm.amperageData = diagramsService.getAmperageData(vm.measurementRecords);
                // Get filtered results
                vm.results = measurementResultService.calcAndGetResults(
                    vm.measurementRecords,
                    vm.filteredVoltageRecords
                        ? vm.filteredVoltageRecords
                        : vm.measurementRecords);
            }
        }
        

        /**
         *
         * @param filterMin Minimum value of filter range
         * @param filterMax Maximum value of filter range
         * @returns {boolean} True if validations are passed
         */
        function validateFilters(filterMin, filterMax) {
            // Validate filters
            if (isNaN(filterMin) || isNaN(filterMax)) {
                toastr.error("مقادیر وارد شده نامعتبر هستند");
                return false;
            }
            if (filterMin > filterMax) {
                toastr.error("ابتدا مقدار کوچکتر را وارد کنید");
                return false;
            }
            if (filterMin == filterMax) {
                toastr.error("مقادیر مینیمم و ماکزیمم با هم برابرند");
                return false;
            }

            return true;
        }

        function round(number) {
            return mathService.to_exponential_3(number);
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
    }

    angular.module("noiseApp").controller("addFilterController", addFilterController);
    addFilterController.$inject = ["$location", "tempStorageService", "diagramsService",
        "measurementResultService", "mathService"];
})();
