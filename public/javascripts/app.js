(function() {

    'use strict'

    var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'hint', 'ngAnimate']);

    app.config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/question');
        $stateProvider.state('question', {
            url: '/question',
            templateUrl: 'modules/questions/list.html',
            controller: QuestionsCtrl
        })
    });
})();