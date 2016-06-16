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

            // Execute the start function
            


            //==== Function implementations ====//
        }


        homeController.$inject = ["$location", "$scope", "blockUI", "measurementService",
            "measurementRecordService", "measurementResultService", "mathService",
            "pointService"];

        return homeController;
    });
})();