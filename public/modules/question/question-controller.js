(function() {

    'use strict';

    angular.module('main')
        .controller('QuestionCtrl', function($scope, $http, $uibModal, Interview, $state, $stateParams) {

            var self = this;

            self.questionInfoPopover = {
                content: 'Hello, World!',
                templateUrl: 'questionPopover.html',
                title: 'Title'
            };

            // $scope.$on('deleteSucessOnQuestion', function(event, data) {
            //     console.log(data);
            //     self.deleteQuestion = data;
            // });

            var reloadCurrent = function(){    
                $state.transitionTo($state.current, uriEncode($stateParams), { 
                  reload: true, inherit: false, notify: true 
                });
            }

            // self.setCompany = function(company){
            //     $stateParams = {};
            //     $stateParams.qCompany = company;

            //     reloadCurrent();
            // }

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

            // self.setTag = function(tag){
            //     console.log('in setTag', tag);
            //     $stateParams = {};
            //     $stateParams.qTag = tag;

            //     console.log('in setTag stateParams', $stateParams);

            //     reloadCurrent();
            // }

            // self.setDate = function(date){
            //     console.log('in setDate', date);
            //     $stateParams = {};
            //     $stateParams.befored = date;
            //     $stateParams.afterd = date;

            //     reloadCurrent();
            // }

            self.loadQuestions = function() {
                $stateParams.page = self.qPage;
                $stateParams.psize = self.qSize;
                console.log('loadQuestion stateParams', $stateParams);
                $http.get('/api/question', {
                    params: uriDecode($stateParams)
                }).success(function(data) {
                    console.log("loadQuestions", data);
                    self.questionGroup = data.question;
                    self.questionCount = data.questionCount;
                }).catch(console.error)
            }

            self.sortBy = function(pSort) {
                $stateParams.psorta *= -1;
                $stateParams.pSort = pSort;
                $state.transitionTo($state.current, $stateParams, { 
                  reload: true, inherit: false, notify: true 
                });
            }
            
            self.showInterview = function(question) {
                $state.go('questionDetail', {qid: question._id});
            }        

            self.setPage = function(){
                $stateParams.page = self.qPage;
                reloadCurrent();
            }

            self.init = function() {
                $stateParams.page = $stateParams.page || 1;
                $stateParams.psize = $stateParams.psize || 10;
                $stateParams.psorta = $stateParams.psorta || -1;   
                self.qSize = $stateParams.psize;
                self.qPage = $stateParams.page;

                console.log("in init", self.qPage);       
                self.loadQuestions();
            }
            self.init();

        })
        .controller('QuestionDetailCtl', ['$scope', '$state', '$http', 'LoginService', '$stateParams', '$rootScope', function($scope, $state, $http, LoginService, $stateParams, $rootScope){
            var self = this;
            if(!$stateParams.qid){
                $state.go('question');
                return;
            }

            self.comments = [];
            self.tags = [];
            self.deleteSucess =false;

            self.loadQuestion = function(qid){
                console.log('in!');
                $http.get('/question/'+qid).success(function(data){
                    // console.log('data', data);
                    if(data.ok){
                        self.questionData = data.questionById;
                        self.updateComments(self.questionData._id);
                    }else{
                        console.log("can't get question with id", qid);
                    }
                })
            }

            self.closeEdit = function() {
                self.editQuestion = !self.editQuestion
                self.editSuccess = false;
            }

            self.updateTag = function(newTag) {
                if(!newTag) {
                    return;
                }
                self.tags.push(newTag);
            }

            self.removeTag = function(idx) {
                if(idx < 0 || idx >= self.tags.length ) return;
                self.tags.splice(idx, 1);
            }

            self.updateQuestion = function(updateDes, updateTags, qid) {
                if(!updateDes) {
                    return;
                }
                $http.put('/question/'+qid, {
                    description: updateDes,
                    tags: updateTags,
                    id: qid
                }).success(function(res) {
                    self.editSuccess = true;
                    self.questionData.tags = res.newTags;
                });
            }

            self.deleteQuestion = function(qid) {
                if(!qid) {
                    return;
                }
                $http.delete('/question/'+qid, {
                    id: qid
                }).success(function(res) {
                    self.deleteSucess = true;
                    // $rootScope.$broadcast('deleteSucessOnQuestion', self.deleteSucess);
                    // $state.go('question');
                })
            }

            self.newComment = function(comment, qid){
                console.log("comment", comment);
                console.log("questionData", self.questionData._id);
                console.log("qid", qid);
                console.log("username", LoginService.getUser() && LoginService.getUser().user);
                $http.post('/api/comment',{
                    comment: comment,
                    _id: qid,
                    username: LoginService.getUser() && LoginService.getUser().user
                })
                .success(function(res){
                    self.comments.push({
                        username: LoginService.getUser().user,
                        comment: comment
                    })  
                });
            }

            self.updateComments = function(qid){
                console.log("update comments");
                console.log("qid", qid);
                $http.get('/api/comment', { params: {qid: qid} })
                    .success(function(data){
                        console.log('comments', data);
                        self.comments = data
                })
            }

            self.loadQuestion($stateParams.qid);

        }])
})()
