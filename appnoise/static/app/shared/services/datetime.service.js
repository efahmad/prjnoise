(function () {
    "use strict";

    define(["moment-timezone"], function (moment) {

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

        dateTimeService.$inject = [];
        return dateTimeService;
        
    });

})();