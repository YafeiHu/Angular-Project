(function(){

	'use strict';

	angular.module('main')
	        .controller('NewInterviewCtl', ['$scope', '$state', '$http', function($scope, $state, $http){

            $scope.fetchClients = function(client){
                if(!client){
                    return [];
                }
                return $http.get('/interview', { params: {query: client} });
            }

            //add question------------------------------
            $scope.questions = [];
            
            $scope.fetchTags =function(tag){
                if(!tag){
                    return [];
                }
                return $http.get('/api/tag', { params: {query: tag} });
            }

            $scope.curQuestion = {
                description: "",
                tags:[]
            }

            $scope.reset = function(question){
                question.description = '';
                question.tags = [];
                return;
            }

            $scope.addQuestion = function(question){
                if(!question.description) return;
                $scope.questions.push(angular.copy(question));
                $scope.reset($scope.curQuestion);
            }

            $scope.removeQuestion = function(idx){
                if(idx < 0 || idx >= $scope.questions.length) return;
                $scope.questions.splice(idx, 1);
            }

            $scope.editQuestion = function(idx){
            }

            $scope.addTag = function(tag, question){
                if(!tag) return;

                console.log('tag in addTag', tag);
                if (question.tags.indexOf(tag) < 0)
                    question.tags.push(tag);
                tag = null;
                return;
            }

            $scope.removeTag = function(idx, question){
                if(idx < 0 || idx >= question.tags.length) return;
                question.tags.splice(idx, 1);
            }
            // end of add question------------------------------

            $scope.submitQuestion = function(question){
                if(!question.description) return;
                $scope.questions.push(angular.copy(question));
                var interview = {
                    Client: $scope.client,
                    Date: $scope.Date,
                    Candidate: $scope.Candidate,
                    Type: $scope.Type, 
                }

                $http.post('/interview', {it :interview, qs: $scope.questions}).success(function(data){
                    // console.log('submitQuestion', data);
                    $scope.insertSuccess = true;
                    //reset
                    $scope.Candidate = null;
                    $scope.Type = null;
                    $scope.Date = null;
                    $scope.client = null;
                    $scope.questions = [];
                    $scope.curQuestion = {
                        question: "",
                        tags:[]
                    }
                });
            }
        }])
})();