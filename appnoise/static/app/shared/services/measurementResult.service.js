(function () {
    "use strict";

    function measurementResultService($http) {
        var service = {
            add: add,
            remove: remove,
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

        function remove(id) {
            return $http({
                url: "/measurementResults/" + id + "/",
                method: "DELETE"
            });
        }

        function calcAndGetResults(amperageFilteredRecords, voltageFilteredRecords) {
            var amperageSquareSum = 0,
                amperageArray = [],
                voltageArray = [],
                tempResult = {
                    average: NaN,
                    rms: NaN,
                    si: NaN,
                    li: NaN,
                    sv: NaN,
                    rn: NaN,
                    icorr: NaN,
                    mpy: NaN
                };

            if (!voltageFilteredRecords) {
                voltageFilteredRecords = amperageFilteredRecords;
            }

            if (amperageFilteredRecords.length == 0 || voltageFilteredRecords.length == 0) {
                return tempResult;
            }

            for (var i = 0; i < amperageFilteredRecords.length; i++) {
                amperageArray.push(amperageFilteredRecords[i].amperage);
                amperageSquareSum += Math.pow(amperageFilteredRecords[i].amperage, 2);
            }

            for (var i = 0; i < voltageFilteredRecords.length; i++) {
                voltageArray.push(voltageFilteredRecords[i].voltage);
            }

            tempResult.average = amperageSquareSum / amperageFilteredRecords.length;
            tempResult.rms = Math.sqrt(tempResult.average);
            tempResult.si = math.std(amperageArray);
            tempResult.li = tempResult.si / tempResult.rms;
            tempResult.sv = math.std(voltageArray);
            tempResult.rn = tempResult.sv / tempResult.si;
            tempResult.icorr = 0.026 / tempResult.rn;
            // Convert & Round icorr to 3 decimal places
            var temp = tempResult.icorr * Math.pow(10, 6);
            tempResult.mpy = 0.128 * temp * 55.8 / 2 / 7.8;
            return tempResult;
        }
    };

    angular.module("noiseApp").factory("measurementResultService", measurementResultService);
    measurementResultService.$inject = ["$http"];
})();