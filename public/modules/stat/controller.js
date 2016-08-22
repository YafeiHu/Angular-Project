(function() {
    'use strict';
    var show = function(dom, xs, ss, title) {
        console.log(dom)
        new Highcharts.Chart({
            chart: {
                renderTo: dom[0],
                height: 300
            },
            title: {
                text: title || 'Interview Trend',
                x: -20
            },
            xAxis: {
                categories: xs
            },
            series: [ss]
        });
    };


    angular.module('main')
        .controller('StatCtrl', [
            function() {
                console.log('stat ctrl init')
            }
        ])
        .directive('statIm', function($http) {
            var showIY = function(dom) {
                console.log(arguments)
                $http.get('/api/stat/iy').success(function(data) {
                    var xAxis = [],
                        series = {
                            name: 'Interview',
                            data: []
                        };
                    for (var y in data) {
                        xAxis.push(y);
                        series.data.push(data[y]);
                    }
                    show(dom, xAxis, series, 'Yearly Interview')
                });
            };

            var showIM = function(dom, y) {
                $http.get('/api/stat/im', {
                    params: {
                        year: y || 2015
                    }
                }).success(function(data) {
                    var xAxis = [],
                        series = {
                            name: 'Interview in ' + y,
                            data: []
                        };
                    data.forEach(function(v) {
                        if (!v) return;
                        xAxis.push(v.m);
                        series.data.push(v.v);
                    });
                    show(dom, xAxis, series, 'Monthly Interview of ' + y)
                })
            };
            console.log('init stat im')
            return {
                scope: {year: '=statYear'},
                link: function(scope, element) {
                    console.log('link stat im', scope.year, element[0])
                    showIM(element, scope.year)
                }
            }
        })
})();
