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
        // Filters
        vm.voltageFilterMin = undefined;
        vm.voltageFilterMax = undefined;
        vm.amperageFilterMin = undefined;
        vm.amperageFilterMax = undefined;
        // Measurement records after applying filter to them
        // which are used to draw diagrams and calc results
        vm.filteredVoltageRecords = undefined;
        vm.filteredAmperageRecords = undefined;
        //
        vm.results = undefined;


        //==== Function definitions ====
        vm.start = start;
        vm.applyVoltageFilter = applyVoltageFilter;
        vm.applyAmperageFilter = applyAmperageFilter;
        vm.validateFilters = validateFilters;
        vm.removeVoltageFilter = removeVoltageFilter;
        vm.removeAmperageFilter = removeAmperageFilter;
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
                filterMax = parseFloat(vm.voltageFilterMax);

            // Check validations
            if (!vm.validateFilters(filterMin, filterMax)) {
                return;
            }

            vm.filteredVoltageRecords = [];

            for (var i = 0; i < vm.measurementRecords.length; i++) {
                if (vm.measurementRecords[i]["voltage"] <= filterMax &&
                    vm.measurementRecords[i]["voltage"] >= filterMin) {
                    vm.filteredVoltageRecords.push(vm.measurementRecords[i]);
                }
            }

            // Get filtered results
            vm.results = measurementResultService.calcAndGetResults(
                vm.filteredAmperageRecords ? vm.filteredAmperageRecords : vm.measurementRecords,
                vm.filteredVoltageRecords);

            // Get diagrams data
            vm.voltageData = diagramsService.getVoltageData(vm.filteredVoltageRecords);
        }

        function applyAmperageFilter() {
            var filterMin = parseFloat(vm.amperageFilterMin),
                filterMax = parseFloat(vm.amperageFilterMax);

            // Check validations
            if (!vm.validateFilters(filterMin, filterMax)) {
                return;
            }

            vm.filteredAmperageRecords = [];

            for (var i = 0; i < vm.measurementRecords.length; i++) {
                if (vm.measurementRecords[i]["amperage"] <= filterMax &&
                    vm.measurementRecords[i]["amperage"] >= filterMin) {
                    vm.filteredAmperageRecords.push(vm.measurementRecords[i]);
                }
            }

            // Get filtered results
            vm.results = measurementResultService.calcAndGetResults(
                vm.filteredAmperageRecords,
                vm.filteredVoltageRecords ? vm.filteredVoltageRecords : vm.measurementRecords);

            // Get diagrams data
            vm.amperageData = diagramsService.getAmperageData(vm.filteredAmperageRecords);
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
                toastr.error("مقدار فیلتر نامعتبر است");
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

        function removeVoltageFilter() {
            vm.voltageFilterMin = undefined;
            vm.voltageFilterMax = undefined;
            vm.filteredVoltageRecords = undefined;

            // Get filtered results
            vm.results = measurementResultService.calcAndGetResults(
                vm.filteredAmperageRecords ? vm.filteredAmperageRecords : vm.measurementRecords,
                vm.measurementRecords);
        }

        function removeAmperageFilter() {
            vm.amperageFilterMin = undefined;
            vm.amperageFilterMax = undefined;
            vm.filteredAmperageRecords = undefined;

            // Get filtered results
            vm.results = measurementResultService.calcAndGetResults(
                vm.measurementRecords,
                vm.filteredVoltageRecords ? vm.filteredVoltageRecords : vm.measurementRecords);
        }

        function round(number) {
            return mathService.to_exponential_3(number);
        }
    }

    angular.module("noiseApp").controller("addFilterController", addFilterController);
    addFilterController.$inject = ["$location", "tempStorageService", "diagramsService",
        "measurementResultService", "mathService"];
})();
