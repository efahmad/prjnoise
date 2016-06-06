/**
 * Created by ahmad on 6/3/2016.
 */
(function () {
    "use strict";

    define(['toastr'], function (toastr) {
        function pointController($location, pointService) {
            //==== Variables ====
            var vm = this;
            vm.points = [];
            vm.point = {
                title: "",
                description: ""
            };
            vm.isInEditMode = false;


            //==== Function definitions ====
            vm.start = start;
            vm.getAllPoints = getAllPoints;
            vm.savePoint = savePoint;
            vm.deletePoint = deletePoint;
            vm.goToEditMode = goToEditMode;
            vm.cancelEditMode = cancelEditMode;
            vm.addFile = addFile;

            // Start the app
            vm.start();


            //==== Function implementations ====
            function start() {
                // Set the view title
                angular.element("#viewTitle").html("نقاط");
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

                if (vm.isInEditMode) {
                    // Edit the current point
                    return pointService.edit(vm.point.id, vm.point.title, vm.point.description)
                        .success(function (data, status) {
                            toastr.success("ویرایش اطلاعات نقطه با موفقیت انجام شد");
                            // Reload all points
                            vm.getAllPoints();
                            vm.cancelEditMode();
                        })
                        .error(function (data, status) {
                            toastr.error("خطا در ویرایش اطلاعات نقطه");
                        });
                } else {
                    // Add a new point
                    return pointService.add(vm.point.title, vm.point.description)
                        .success(function (data, status) {
                            toastr.success("ذخیره سازی اطلاعات نقطه با موفقیت انجام شد");
                            // Reload all points
                            vm.getAllPoints();
                            vm.cancelEditMode();
                        })
                        .error(function (data, status) {
                            toastr.error("خطا در ذخیره سازی اطلاعات نقطه");
                        });
                }

            }

            function deletePoint(id) {
                return pointService.remove(id)
                    .success(function (data, status) {
                        toastr.success("حذف نقطه با موفقیت انجام شد");
                        vm.getAllPoints();
                    })
                    .error(function (data, status) {
                        toastr.error("خطا در حذف نقطه");
                    });
            }

            function goToEditMode(row) {
                vm.isInEditMode = true;
                vm.point = angular.copy(row);
            }

            function cancelEditMode() {
                vm.isInEditMode = false;
                vm.point = {
                    title: "",
                    description: ""
                };
            }

            function addFile(pointId) {
                $location.path('/').search("point_id", pointId);
            }
        }

        pointController.$inject = ["$location", "pointService"];
        return pointController;
    });

})();