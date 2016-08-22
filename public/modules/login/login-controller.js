(function(){
    angular.module('main')
        .controller('SignCtrl', ['$scope', 'LoginService', '$state',function($scope, LoginService, $state){
        
        $scope.userExist = false;

        $scope.errorMessage = "hello?";

        //check if username exist
        $scope.checkUsername = function(username){
            if($scope.userForm.username.$invalid){
                $scope.userExist = false;
                return;
            }

            LoginService.checkUsername(username).then(function(result){
                if(result.data.ok){
                    $scope.userForm.username.$invalid = true;
                    $scope.userExist = true;
                }else{
                    $scope.userExist = false;
                }
            })
        };

        $scope.sign = function(username, password, email){
            LoginService.sign(username, password, email);
            $state.go('question');
        };

        // $scope.changeState = function(){
        //     $state.go('question');
        // }

        $scope.reset = function(){
            $scope.loginUser = null;
            $scope.loginEmail = null;
            $scope.loginPwd = null;
            $scope.confirmPwd = null;
            $scope.userForm.username.$invalid = false;
            $scope.userForm.password.$invalid = false;
            $scope.userForm.email.$invalid = false;
            $scope.userForm.confirmPwd.$invalid = false;
            $scope.userForm.username.$pristine = true;
            $scope.userForm.password.$pristine = true;
            $scope.userForm.email.$pristine = true;
            $scope.userForm.confirmPwd.$pristine = true;
        }

    }]);

})();