(function() {
    "use strict";

    function dateTimeService() {
        var service = {
            toTehranTimeZone: toTehranTimeZone
        };
        return service;

        function toTehranTimeZone(time) {
            var format = 'YYYY/MM/DD HH:mm:ss ZZ';
            var format2 = 'YYYY/MM/DD HH:mm:ss';
            return moment(time, format).tz('Asia/Tehran').format(format2);
        }
    }

    angular.module("noiseApp").factory('dateTimeService', dateTimeService);
    dateTimeService.$inject = [];

})();