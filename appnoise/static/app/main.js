/**
 * Created by ahmad on 6/4/2016.
 */
require.config({
    map: {
        // Maps
    },
    paths: {
        // Aliases and paths of modules

        'jquery': '/static/js/jquery-2.1.4.min',
        'bootstrap': '/static/js/bootstrap.min',
        'toastr': '/static/js/toastr.min',
        'math': '/static/js/math.min',
        'moment': '/static/js/moment',
        'moment-timezone': '/static/js/moment-timezone-with-data',
        'angular': '/static/js/angular.min',
        'angular-route': '/static/js/angular-route.min',
        'angular-animate': '/static/js/angular-animate.min',
        'angular-sanitize': '/static/js/angular-sanitize.min',
        'angular-block-ui': "/static/js/angular-block-ui.min",
        'ui-bootstrap': '/static/js/ui-bootstrap-tpls-1.3.2.min',
        'angular-bootstrap-confirm': '/static/js/angular-bootstrap-confirm.min',
        'loading-bar': '/static/js/loading-bar.min',
        'd3': '/static/js/d3.min',
        'nv.d3': '/static/js/nv.d3.min',
        'angular-nvd3': '/static/js/angular-nvd3.min',

        // App module
        "noiseApp": "/static/app/app",

        // Config
        "config": "/static/app/config",

        // Services
        "measurementService": "/static/app/shared/services/measurement.service",
        "measurementRecordService": "/static/app/shared/services/measurementRecord.service",
        "measurementResultService": "/static/app/shared/services/measurementResult.service",
        "mathService": "/static/app/shared/services/math.service",
        "pointService": "/static/app/shared/services/point.service",
        "dateTimeService": "/static/app/shared/services/datetime.service",
        "diagramsService": "/static/app/shared/services/diagrams.service",

        // Directives
        
        // Controllers
        "menuController": "/static/app/components/menu/menu.controller",
        "homeController": "/static/app/components/home/home.controller",
        "measurementController": "/static/app/components/measurement/measurement.controller",
        "measurementResultController": "/static/app/components/measurementResult/measurementResult.controller",
        "addFilterController": "/static/app/components/measurementResult/addFilter.controller",
        "reportController": "/static/app/components/resultReports/report.controller",
        "pointController": "/static/app/components/point/point.controller",
        "measurementAddController": "/static/app/components/measurement/measurementAdd.controller"
    },
    shim: {
        // Modules and their dependent modules
        'toastr': ['jquery'],
        'math': ['jquery'],
        'bootstrap': ['jquery'],
        'moment': ['jquery'],
        'moment-timezone': ['moment'],
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-route': ['angular'],
        'angular-animate': ['angular'],
        'angular-sanitize': ['angular'],
        'angular-block-ui': ['angular'],
        'ui-bootstrap': ['angular'],
        'angular-bootstrap-confirm': ['ui-bootstrap'],
        'loading-bar': ['angular'],
        'nv.d3': ['d3'],
        'angular-nvd3': ['angular', 'nv.d3']
    }
});

require(['toastr'], function (toastr) {
    // Config toastr
    toastr.options.positionClass = "toast-bottom-left";
});

require(['angular', 'noiseApp'], function (angular) {
        angular.bootstrap(document, ['noiseApp']);
    }
);