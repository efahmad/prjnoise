(function () {
    "use strict";

    define(['toastr'], function (toastr) {

        function measurementController($location, measurementService, dateTimeService) {

            var vm = this;
            vm.header = "نتایج پیشین";
            vm.dateTimeService = dateTimeService;
            vm.activeTab = 1;
            vm.measurements = [];
            vm.noises = [];

            //==== Function Definitions ====//
            vm.getMeasurements = getMeasurements;
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
                $location.path('/measurementResults').search("measurement_id", measurement.id);
            }
        }

        measurementController.$inject = ["$location", "measurementService", "dateTimeService"];
        return measurementController;
    });

})();