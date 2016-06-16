/**
 *
 */

(function () {
    'use strict';

    define(['toastr'], function (toastr) {
        function homeController() {

            //==== Variables ====//
            var vm = this;

            //==== Function Definitions ====//
            vm.start = start;

            // Execute the start function
            vm.start();

            //==== Function implementations ====//
            function start() {
                // Set the view title
                angular.element("#viewTitle").html("");
            }
        }


        homeController.$inject = ["$location", "$scope", "blockUI", "measurementService",
            "measurementRecordService", "measurementResultService", "mathService",
            "pointService"];

        return homeController;
    });
})();