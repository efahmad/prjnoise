/**
 * Created by ahmad on 5/21/2016.
 */
(function () {
    "use strict";

    function diagramsService(mathService) {
        var service = {
            getDefaultOptions: getDefaultOptions,
            getVoltageOptions: getVoltageOptions,
            getAmperageOptions: getAmperageOptions,
            getVoltageData: getVoltageData,
            getAmperageData: getAmperageData
        };

        var options = {
            chart: {
                type: 'lineChart',
                height: 500,
                margin: {
                    top: 50,
                    right: 50,
                    bottom: 75,
                    left: 150
                },
                x: function (d) {
                    return d.x;
                },
                y: function (d) {
                    return d.y;
                },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function (e) {
                        console.log("stateChange");
                    },
                    changeState: function (e) {
                        console.log("changeState");
                    },
                    tooltipShow: function (e) {
                        console.log("tooltipShow");
                    },
                    tooltipHide: function (e) {
                        console.log("tooltipHide");
                    }
                },
                xAxis: {
                    axisLabel: 'Time (s)',
                    axisLabelDistance: 10
                },
                yAxis: {
                    tickFormat: function (d) {
                        // return d3.format('.03f')(d);
                        return mathService.to_exponential_3(d);
                    },
                    axisLabelDistance: 50
                }
                //,
                // callback: function (chart) {
                //     console.log("!!! lineChart callback !!!");
                // }
            },
            title: {
                enable: true
            }
            // ,
            // subtitle: {
            //     enable: true,
            //     text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
            //     css: {
            //         'text-align': 'center',
            //         'margin': '10px 13px 0px 7px'
            //     }
            // }
        };

        return service;

        function getDefaultOptions() {
            // Shared options for voltage & amperage diagrams
            return options;
        }

        function getVoltageOptions() {
            var voltageOptions = angular.copy(getDefaultOptions());
            voltageOptions.chart.yAxis.axisLabel = 'Voltage (v)';
            voltageOptions.title.text = "نمودار نوسانات پتانسیل بر حسب زمان";

            return voltageOptions;
        }

        function getAmperageOptions() {
            var amperageOptions = angular.copy(getDefaultOptions());
            amperageOptions.chart.yAxis.axisLabel = "Amperage (A)";
            amperageOptions.title.text = "نمودار نوسانات جریان بر حسب زمان";
            
            return amperageOptions;
        }

        function getVoltageData(measurementRecords, filters) {
            return getDataForDiagram(measurementRecords, "voltage", "Voltage Wave", "#2ca02c");
        }

        function getAmperageData(measurementRecords, filters) {
            return getDataForDiagram(measurementRecords, "amperage", "Amperage Wave", "#2ca02c");
        }

        function getDataForDiagram(noisesData, columnName, key, color) {
            var temp = [],
                i;

            for (i = 0; i < noisesData.length; i++) {
                temp.push({
                    x: noisesData[i].time,
                    y: noisesData[i][columnName]
                });
            }

            // Line chart data should be sent as an array of series objects.
            return [{
                values: temp,
                key: key,
                color: color
            }];
        }
    }

    angular.module("noiseApp").factory("diagramsService", diagramsService);
    diagramsService.$inject = ["mathService"];
})();
