/**
 *
 */
(function () {
    angular.module("noiseApp", ["ngRoute", "nvd3", "angular-loading-bar", "ngAnimate",
        "blockUI", "mwl.confirm", "ui.bootstrap"])
        .config(function (blockUIConfig) {
            /**
             * angular-block-ui config
             */
            // Change the default overlay message
            blockUIConfig.message = 'در حال بارگذاری ...';
            // Change the default delay to 100ms before the blocking is visible
            blockUIConfig.delay = 100;
        })
        .config(function (uibDatepickerConfig, uibDatepickerPopupConfig) {
            uibDatepickerConfig.showWeeks = false;
            uibDatepickerPopupConfig.toggleWeeksText = null;
            uibDatepickerPopupConfig.showButtonBar = false;
        });
})();