(function () {
    "use strict";

    function measurementController($location, measurementService, dateTimeService, tempStorageService) {

        var vm = this;
        vm.header = "نتایج پیشین";
        vm.dateTimeService = dateTimeService;
        vm.activeTab = 1;
        vm.measurements = [];
        vm.noises = [];

        //==== Function Definitions ====//
        vm.getMeasurements = getMeasurements;
        vm.calcResults = calcResults;
        vm.deleteFile = deleteFile;
        vm.viewResults = viewResults;
        vm.start = start;

        // Start the app
        vm.start();

        //==== Function Implementations ====//
        function start() {

            // Set view title
            angular.element("#viewTitle").html("فایل های ذخیره شده");

            vm.getMeasurements();
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

        /**
         * Deletes a file by it's id. this function also removes all of the file records and it's results
         * @param fileId
         */
        function deleteFile(fileId) {
            measurementService.remove(fileId).success(function (data, status) {
                toastr.success("فایل با موفقیت حذف شد");
                // Reload measurement files list
                vm.getMeasurements();
            }).error(function (data, status) {
                toastr.error("خطا در حذف فایل");
            });
        }

        function viewResults(measurement) {
            // Save measurement to temp storage to retrieve it in the target view
            tempStorageService.saveMeasurement(measurement);
            $location.path('/measurementResults');
        }
    }

    angular.module("noiseApp").controller("measurementController", measurementController);
    measurementController.$inject = ["$location", "measurementService", "dateTimeService", "tempStorageService"];

})();