(function(){
    "use strict";
    
    var statsCodes = {
        OK: 200,
        INTERNAL_SERVER_ERROR: 500
    };
    
    angular.module("noiseApp").constant("statusCodes", statsCodes);
})();