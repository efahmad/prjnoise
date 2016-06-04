/**
 * Created by ahmad on 6/4/2016.
 */
(function () {
    "use strict";

    define([], function () {
        function menuController($location) {
            // ==== variables ====//
            var vm = this;
            vm.activePath = "#" + $location.path();


            //==== function definitions ====//
            vm.setActivePath = setActivePath;


            //==== function implementations ====//
            function setActivePath(path) {
                vm.activePath = path;
            }
        }

        menuController.$inject = ["$location"];
        return menuController;
    });

})();