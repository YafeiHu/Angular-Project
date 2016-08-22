(function() {

    'use strict'

    angular.module('interview')
        .controller('interviewController', ['$scope', '$http', '$uibModal', 'Interview', '$state', '$stateParams', function($scope, $http, $uibModal, Interview, $state, $stateParams) {
            var self = this;

            var reloadCurrent = function(){    
                $state.transitionTo($state.current, uriEncode($stateParams), { 
                  reload: true, inherit: false, notify: true 
                });
            }

            var uriEncode = function(obj){
                for(var property in obj){
                    if(!!obj[property]) obj[property] = encodeURIComponent(obj[property]);
                }

                return obj;
            }

            var uriDecode = function(obj){
                for(var property in obj){
                    if(!!obj[property]) obj[property] = decodeURIComponent(obj[property]);
                }
                return obj;
            }

            self.setPage = function(){
                $stateParams.page = self.iPage;
                reloadCurrent();
            }

            self.showQuestion = function(q){
                $state.go('questionDetail', {qid: q._id});
            }

            self.loadInterviews = function() {
                console.log('in loadInterviews stateParams', $stateParams);
                $http.get('/api/interview', {
                    params: uriDecode($stateParams)
                }).success(function(data) {
                    console.log('this is the data in the loadInterviews function', data);
                    self.interviewQuestion = data.interview;
                    self.interviewCount = data.interviewCount;
                }).catch(console.error);
            }

            self.showInterview = function(interviewId, client) {
                self.questionDetailNull = false;
                Interview.get({
                    id: interviewId
                }, function(itData) {
                    self.interviewInfo = itData;
                    $http.get('/api/question/all').success(function(qsData) {
                        self.questionGroup = qsData;
                        self.questionArray = _.filter(self.questionGroup, function(item) {
                            return item.interview.Client == client;
                        });
                        console.log('questionGroup', self.questionGroup);
                        console.log('questionArray', self.questionArray);
                        if(_.isEmpty(self.questionArray)) {
                            self.questionDetailNull = true;
                        }
                        $uibModal.open({
                            templateUrl: "modules/interview/interview-detail.html",
                            size: "lg",
                            scope: $scope
                        });
                    }).catch(console.error);
                });
            }

            $scope.sortBy = function(pSort) {
                console.log('in sortBy', pSort);
                console.log('in sortBy psorta', $stateParams.psorta);
                if(!$stateParams.psorta) $stateParams.psorta = -1;
                $stateParams.psorta = parseInt($stateParams.psorta)*-1;
                $stateParams.pSort = pSort;
                console.log('in sortBy psorta', $stateParams.psorta);
                console.log('in sortBy stateParams', $stateParams);
                reloadCurrent();
            }

            // self.data = {
            //     availableOptions: [{
            //         id: '1',
            //         iSize: '5'
            //     }, {
            //         id: '2',
            //         iSize: '10'
            //     }, {
            //         id: '3',
            //         iSize: '15'
            //     }, {
            //         id: '4',
            //         iSize: '20'
            //     }],
            //     selectedOption: {
            //         id: '2',
            //         iSize: '10'
            //     }
            // };

            self.init = function() {
                console.log('loadInterviews init!');
                // self.iPage = 1;
                // self.iSize = self.iSize = self.data.selectedOption.iSize;
                $stateParams.page = $stateParams.page || 1;
                $stateParams.psize = $stateParams.psize || 10;
                $stateParams.psorta = $stateParams.psorta || -1;
                self.iSize = $stateParams.psize;
                self.iPage = $stateParams.page;
                self.loadInterviews();
            }

            self.init();
        }]
    );
})()
