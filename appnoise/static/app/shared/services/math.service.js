/**
 * Created by ahmad on 5/19/2016.
 */
(function () {
    "use strict";

    function mathService() {
        var service = {
            round: round,
            to_exponential_3: to_exponential_3
        };
        return service;

        /**
         * Rounds a float number to at most 2 decimal places
         * @param number The float number which we round
         * @returns {number} The rounded number
         */
        function to_exponential_3(number) {
            return number.toExponential(3);
        }

        /**
         * Rounds a float number to at most the given decimal places
         * @param number The float number which we round
         * @param places The places to which round the number
         * @returns {number} The rounded number
         */
        function round(number, places) {
            return math.round(number * math.pow(10, places)) / math.pow(10, places)
        }

    }

    angular.module("noiseApp").factory("mathService", mathService);
    mathService.$inject = [];
})();
