(function () {
    "use strict";

    define(["moment-timezone"], function (moment) {

        function dateTimeService() {
            var service = {
                toTehranTimeZone: toTehranTimeZone,
                formatToDateTime: formatToDateTime,
                getAsUTC: getAsUTC
            };
            return service;

            function toTehranTimeZone(time) {
                var inFormat = 'YYYY/MM/DD HH:mm:ss ZZ';
                var toFormat = 'YYYY/MM/DD HH:mm:ss';
                return moment(time, inFormat).tz('Asia/Tehran').format(toFormat);
            }

            function formatToDateTime(datetime) {
                var inFormat = 'YYYY/MM/DD HH:mm:ss ZZ';
                var toFormat = 'YYYY/MM/DD HH:mm:ss';
                return moment(datetime, inFormat).tz('UTC').format(toFormat);
            }

            function getAsUTC(date) {
                return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                    date.getHours(), date.getMinutes(), date.getSeconds()));
            }
        }

        dateTimeService.$inject = [];
        return dateTimeService;

    });

})();