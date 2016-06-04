/**
 * Created by ahmad on 6/3/2016.
 */
(function () {
    "use strict";

    define(['toastr'], function (toastr) {
        function pointController(pointService) {
            //==== Variables ====
            var vm = this;
            vm.points = [];
            vm.point = {
                title: "",
                description: ""
            };

            //==== Function definitions ====
            vm.start = start;
            vm.getAllPoints = getAllPoints;
            vm.savePoint = savePoint;


            // Start the app
            vm.start();


            //==== Function implementations ====
            function start() {
                // Set the view title
                angular.element("#viewTitle").html("نقاط");

                debugger;
                vm.getAllPoints();
            }

            function getAllPoints() {
                return pointService.getAll()
                    .success(function (data, status) {
                        vm.points = data;
                        for (var i = 0; i < vm.points.length; i++) {
                            vm.points[i].rowNum = i + 1;
                        }
                    })
                    .error(function (data, status) {
                        toastr.error("خطا در دریافت لیست نقاط");
                    });
            }

            function savePoint() {
                // Check validations
                if (vm.point.title.trim() === "") {
                    toastr.error("عنوان نقطه را وارد کنید.");
                    return;
                }

                return pointService.add(vm.point.title, vm.point.description)
                    .success(function (data, status) {
                        toastr.success("ذخیره سازی اطلاعات نقطه با موفقیت انجام شد");
                        // Reload all points
                        vm.getAllPoints();
                        // TODO: Clear the form
                    })
                    .error(function (data, status) {
                        toastr.error("خطا در ذخیره سازی اطلاعات نقطه");
                    });
            }
        }

        pointController.$inject = ["pointService"];
        return pointController;
    });

})();