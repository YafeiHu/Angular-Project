(function() {

    'use strict'

    angular.module('login')
        .directive('pwCheck', function(){
            return {
                require: '^ngModel',
                scope: {
                    otherVal: '=compareTo'
                },
                link: function(scope, element, attr, ngModelCtrl){
                    //regiester a new validator
                    ngModelCtrl.$validators.compareTo = function(modelVal){
                        return modelVal == scope.otherVal;
                    }
                    scope.$watch('otherVal', function(newVal){
                        ngModelCtrl.$validate(newVal);
                    })
                }
            }
        })
        .directive('loginForm', function(LoginService) {
            return {
                templateUrl: '/modules/login/login-form.html',
                controller: function($scope) {
                    $scope.$on(LoginService.EVENT_LOGIN, function(e, info) {
                        console.log('login finish', info)
                        $scope.msg = info.msg;
                    })
                    
                    $scope.login = function(usr, pwd) {
                        LoginService.login(usr, pwd);
                    }
                    
                    // $scope.sign = function(usr, pwd) {
                    //     LoginService.sign(usr, pwd);
                    // }

                    // $scope.checkUsername = function(username){
                    //     console.log('checkUsername', username);
                    //     LoginService.checkUsername(username).then(function(exist){
                    //         console.log('username exist', exist);
                    //         if(exist){
                    //             $scope.usernameExist = true;
                    //         }else{
                    //             $scope.usernameExist = false;
                    //         }
                    //     })
                    // }
                }
            };
        })
        .directive('loginNav', function() {
            return {
                templateUrl: '/modules/login/login-nav.html',
                controller: function($uibModal, $scope, $log, LoginService) {
                    $scope.$on(LoginService.EVENT_LOGIN, function(e, info) {
                        console.log('login finish', info)
                        $scope.user = info.user;
                    })

                    $scope.open = function() {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            template: '<login-form></login-form>',
                            resolve: {}
                        });

                        $scope.$on(LoginService.EVENT_LOGIN, function(e, info) {
                            !!info.user && modalInstance.close();
                        })
                    }

                    $scope.logout = function() {
                        $scope.user = undefined;
                        LoginService.logout();
                    }

                    LoginService.check();
                },
                link: function(scope) {
                    scope.$on('$destroy', function() {
                        // TODO
                    });
                }
            }
        })
})();