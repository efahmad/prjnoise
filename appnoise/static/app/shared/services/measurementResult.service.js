(function() {
    "use strict";

    function measurementResultService($http) {
        var service = {
            add: add,
            calcAndGetResults: calcAndGetResults
        };
        return service;

        function add(measurementResult) {
            return $http({
                url: "/measurementResults/",
                method: "POST",
                data: measurementResult
            });
        }

        function calcAndGetResults(noisesData) {
            var amperageSquareSum = 0,
                amperageArray = [],
                voltageArray = [],
                tempResult = {};

            for (var i = 0; i < noisesData.length; i++) {
                amperageArray.push(noisesData[i].amperage);
                voltageArray.push(noisesData[i].voltage);

                amperageSquareSum += Math.pow(noisesData[i].amperage, 2);
            }

            tempResult.average = amperageSquareSum / noisesData.length;
            tempResult.rms = Math.sqrt(tempResult.average);
            tempResult.si = math.std(amperageArray);
            tempResult.li = tempResult.si / tempResult.rms;
            tempResult.sv = math.std(voltageArray);
            tempResult.rn = tempResult.sv / tempResult.si;
            tempResult.icorr = 0.026 / tempResult.rn;
            // Convert & Round icorr to 3 decimal places
            var temp = tempResult.icorr * Math.pow(10, 6);
            temp = Math.floor(temp * 1000) / 1000;
            temp = Math.ceil(temp * 1000) / 1000;
            tempResult.mpy = 0.128 * temp * 55.8 / 2 / 7.8;
            return tempResult;
        }
    };

    angular.module("noiseApp").factory("measurementResultService", measurementResultService);
    measurementResultService.$inject = ["$http"];
})();