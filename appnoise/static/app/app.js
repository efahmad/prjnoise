/**
 *
 */
(function () {
    "use strict";

    define([
            // configs
            "config",

            // Services
            "measurementService",
            "measurementRecordService",
            "measurementResultService",
            "mathService",
            "pointService",
            "dateTimeService",
            "diagramsService",

            // Controllers
            "menuController",
            "homeController",
            "measurementController",
            "measurementResultController",
            "addFilterController",
            "reportController",
            "pointController",

            "angular-route",
            "angular-animate",
            "angular-block-ui",
            "ui-bootstrap",
            "angular-bootstrap-confirm",
            "loading-bar",
            "angular-nvd3",
            "bootstrap",
            "toastr"
        ],
        function (config,
                  measurementService,
                  measurementRecordService,
                  measurementResultService,
                  mathService,
                  pointService,
                  dateTimeService,
                  diagramsService,
                  menuController,
                  homeController,
                  measurementController,
                  measurementResultController,
                  addFilterController,
                  reportController,
                  pointController) {

            var app = angular.module("noiseApp", ["ngRoute", "blockUI",
                "ui.bootstrap", "ngAnimate", "mwl.confirm", "angular-loading-bar",
                "nvd3"
            ]);

            // Config
            app.config(config);

            // Services
            app.factory("measurementService", measurementService);
            app.factory("measurementRecordService", measurementRecordService);
            app.factory("measurementResultService", measurementResultService);
            app.factory("mathService", mathService);
            app.factory("pointService", pointService);
            app.factory("dateTimeService", dateTimeService);
            app.factory("diagramsService", diagramsService);

            // Controllers
            app.controller("menuController", menuController);
            app.controller("homeController", homeController);
            app.controller("measurementController", measurementController);
            app.controller("measurementResultController", measurementResultController);
            app.controller("addFilterController", addFilterController);
            app.controller("reportController", reportController);
            app.controller("pointController", pointController);
        });

})();