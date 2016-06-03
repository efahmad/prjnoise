/**
 *
 */

(function () {
    'use strict';

    function homeController($scope, blockUI, measurementService, measurementRecordService,
                            measurementResultService, mathService) {

        //==== Variables ====//
        var vm = this;
        vm.selectedFileName = "";
        vm.showSaveButton = false;
        vm.noises = [];


        //==== Function Definitions ====//
        vm.saveMeasurement = saveMeasurement;
        vm.saveMeasurementRecords = saveMeasurementRecords;
        vm.saveMeasurementResult = saveMeasurementResult;
        vm.saveData = saveData;
        vm.start = start;
        vm.clearForm = clearForm;
        vm.selectFile = selectFile;
        vm.round = round;

        // Execute the start function
        vm.start();


        //==== Function implementations ====//
        function start() {
            // Set view title
            angular.element("#viewTitle").html("افزودن فایل");
        }

        function saveMeasurement(measurement) {
            // Save measurement
            return measurementService.add(measurement)
                .success(function (data, status) {
                    // Save measurement records
                    vm.saveMeasurementRecords(data).success(function (recordData, recordStatus) {
                        // Save a default (main) measurement result
                        vm.saveMeasurementResult(data).success(function () {
                            // Hide save button
                            vm.showSaveButton = false;
                            toastr.success("ذخیره داده ها با موفقیت انجام شد");
                            vm.clearForm();
                        }).error(function () {
                            toastr.error("خطا در عملیات ذخیره سازی");
                        });
                    }).error(function (data, status) {
                        toastr.error("خطا در عملیات ذخیره سازی");
                    });
                })
                .error(function (data, status) {
                    toastr.error("خطا در عملیات ذخیره سازی");
                });
        }

        function saveMeasurementRecords(measurement) {
            var temp = [];
            for (var i = 0; i < vm.noises.length; i++) {
                temp.push({
                    id: 0,
                    time: vm.noises[i].time,
                    temperature: vm.noises[i].temp,
                    voltage: vm.noises[i].voltage,
                    amperage: vm.noises[i].amperage,
                    measurement: measurement.id
                });
            }
            return measurementRecordService.addMany(temp);
        }

        function saveMeasurementResult(measurement) {
            var measurementResult = measurementResultService.calcAndGetResults(vm.noises);
            measurementResult.measurement = measurement.id;
            measurementResult.isMainResult = true;
            return measurementResultService.add(measurementResult);
        }

        function clearForm() {
            vm.noises = [];
            vm.showSaveButton = false;
            vm.selectedFileName = "";
        }

        /* Will be executed after that the user selects a file */
        $scope.fileNameChanged = function (element) {
            var file = element.files[0];
            var i, lineItems;
            var reader = new FileReader();

            // Reset previous data
            vm.noises = [];
            $scope.$apply();

            reader.onload = function (progressEvent) {
                // Free the UI
                blockUI.stop();
                // Read by lines
                var lines = this.result.trim().split('\n');
                var tempNoise = {};
                var rowCounter = 0;

                vm.selectedFileName = file.name;

                // Start from the second line (the first line is data header)
                for (i = 1; i < lines.length; i += 1) {
                    lineItems = lines[i].trim().split(/\s+/);
                    tempNoise = {
                        time: parseFloat(lineItems[0]),
                        temp: parseFloat(lineItems[1]),
                        voltage: parseFloat(lineItems[2]),
                        amperage: parseFloat(lineItems[3])
                    };
                    if (isNaN(tempNoise.time) || isNaN(tempNoise.temp) || isNaN(tempNoise.voltage) || isNaN(tempNoise.amperage)) {
                        toastr.error("خطا در داده های ورودی");
                        // data is not valid show don't let the user to save them
                        vm.clearForm();
                        $scope.apply();
                        return;
                    } else {
                        rowCounter++;
                        tempNoise.rowNum = rowCounter;
                        vm.noises.push(tempNoise);
                    }
                }

                // show save button
                vm.showSaveButton = true;
                // Apply changes to the scope
                $scope.$apply();
            };
            // Block the ui
            blockUI.start("در حال بارگذاری فایل ...");
            // Start reading the file
            reader.readAsText(file);
        };

        function saveData() {
            // Get date & time from file name
            var dateArray = vm.selectedFileName.split("Date(")[1].split(")")[0].split("-");
            var timeArray = vm.selectedFileName.split("Time(")[1].split(")")[0].split(".");

            var day = parseInt(dateArray[0]);
            var month = parseInt(dateArray[1]) - 1;
            var year = parseInt(dateArray[2]);
            var hour = parseInt(timeArray[0]);
            var minute = parseInt(timeArray[1]);
            var second = parseInt(timeArray[2]);
            var millisecond = 0;

            var fileDate = new Date(year, month, day, hour, minute, second, millisecond);
            var measurement = {
                id: 0,
                title: vm.selectedFileName,
                measurement_date: fileDate
            };

            // TODO: Check if there is not a same measurement for this point in the db

            vm.saveMeasurement(measurement);
        }

        function selectFile() {
            angular.element("#fileSelector").click();
        }

        function round(number) {
            return mathService.to_exponential_3(number);
        }
    }

    angular.module("noiseApp").controller("homeController", homeController);
    homeController.$inject = ["$scope", "blockUI", "measurementService",
        "measurementRecordService", "measurementResultService", "mathService"];

})();