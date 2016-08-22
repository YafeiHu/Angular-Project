(function() {

    'use strict'

    angular.module('main', ['ui.bootstrap', 'ui.router', 'ngResource', 'login', 'interview', 'hint', 'ngAnimate', 'CustomFilter'])
        .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
            // remove hash
            $locationProvider.html5Mode(true);

            // set default router
            $urlRouterProvider.otherwise('/question')

            // provide router
            $stateProvider
                .state('question', {
                    url: '/question?qQuestion&qCompany&pSort&page&psize&psorta&befored&afterd&qTag',
                    templateUrl: 'modules/question/question-list.html',
                    controller: 'QuestionCtrl as question',
                    cache: false
                })
                .state('new', {
                    url: '/new',
                    templateUrl: 'modules/newInterview/question-new.html',
                    controller: 'NewInterviewCtl as newInterview'
                })
                .state('interview', {
                    url: '/interview?iClient&iCandidate&iType&pSort&page&psize&psorta&befored&afterd',
                    template: '<interview-panel></interview-panel>',
                    cache: false
                })
                .state('newUser', {
                    url: '/user/new',
                    templateUrl: 'modules/login/login-new.html',
                    controller: 'SignCtrl'
                })
                .state('questionDetail', {
                    url: '/question/{qid}',
                    templateUrl: 'modules/question/question-detail.html',
                    controller: 'QuestionDetailCtl as questionDetail'
                })
                .state('comments', {
                    url: '/comments/:qid',
                    templateUrl: 'modules/comments/comments.html',
                    controller: 'CommentsCtrl as comments'
                }).state('stat', {
                    url: '/stat',
                    templateUrl: 'modules/stat/main.html',
                    controller: 'StatCtrl as stat'
                });
                
            // add resource

        })
        // .factory('Interview', function($resource) {
        //     return $resource('/api/interview/:id', {
        //         id: '@id'
        //     }, {
        //         get: {
        //             method: 'GET',
        //             params: {
        //                 id: '@id'
        //             }
        //         }
        //     })
        // })
})()
