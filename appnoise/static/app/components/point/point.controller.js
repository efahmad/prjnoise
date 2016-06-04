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

            //==== Function definitions ====
            vm.start = start;
            vm.getAllPoints = getAllPoints;


            // Start the app
            vm.start();


            //==== Function implementations ====
            function start() {
                // Set the view title
                angular.element("#viewTitle").html("نقاط");


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
        }

        pointController.$inject = ["pointService"];
        return pointController;
    });

})();