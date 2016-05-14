/**
 *
 */
(function () {
    angular.module("noiseApp", ["ngRoute", "nvd3", "angular-loading-bar", "ngAnimate", "blockUI"])
        .config(function (blockUIConfig) {
            /**
             * angular-block-ui config
             */
            // Change the default overlay message
            blockUIConfig.message = 'لطفا صبر کنید ...!';

            // Change the default delay to 100ms before the blocking is visible
            blockUIConfig.delay = 100;
        });
})();