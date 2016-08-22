(function() {

    'use strict'

    angular.module('interview')
        .directive('interviewPanel', function() {
            return {
                templateUrl: '/modules/interview/interview-list.html',
                controller: 'interviewController',
                controllerAs: 'interviewList'
            };
        })
})();
