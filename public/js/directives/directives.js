'use strict';

angular.module('projectOne')

.directive('linearChart', function($window) {
    return {
        restrict: 'EA',
        template: "<svg width='850' height='200'></svg>",
        link: function(scope, elem, attrs) {
            console.log(attrs);
            var dataToPlot = scope[attrs.chartData];
            var padding = 20;
            var pathClass = "path";
            var xScale, yScale, xAxisGen, yAxisGen, lineFun;

            var d3 = $window.d3;
            var rawSvg = elem.find("svg")[0];
            var svg = d3.select(rawSvg);

            function setChartParameters() {
                xScale = d3.scale.linear()
                    .domain([dataToPlot[0].day, dataToPlot[dataToPlot.length - 1].day])
                    .range([padding + 5, rawSvg.clientWidth - padding]);

                yScale = d3.scale.linear()
                    .domain([0, d3.max(dataToPlot, function(d) {
                        return d.visitors;
                    })])
                    .range([rawSvg.clientHeight - padding, 0]);

                xAxisGen = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(dataToPlot.length - 1);

                yAxisGen = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);

                lineFun = d3.svg.line()
                    .x(function(d) {
                        return xScale(d.day);
                    })
                    .y(function(d) {
                        return yScale(d.visitors);
                    })
                    .interpolate("basis");
            }

            function drawLineChart() {

                setChartParameters();

                svg.append("svg:g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(10, 180)")
                    .call(xAxisGen);

                svg.append("svg:g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(30,0)")
                    .call(yAxisGen);

                svg.append("svg:path")
                    .attr({
                        d: lineFun(dataToPlot),
                        "stroke": "blue",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass
                    });
            }
            drawLineChart();
        }
    };
});