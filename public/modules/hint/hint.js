(function() {
    angular.module('hint', [])
        .directive('hint', function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=',
                    fetch: '='
                },
                templateUrl: 'modules/hint/hint.html',
                controller: ['$scope', '$http', '$q', function($scope, $http, $q) {
                    $scope.list = [];
                    
                    $scope.selected = -1;

                    $scope.attach = function(idx) {
                        $scope.data = $scope.list[idx];
                    }

                    $scope.mouseover = function(idx) {
                        $scope.selected = idx;
                        $scope.attach($scope.selected);
                    }

                    $scope.keydown = function(e) {
                        switch (e.keyCode) {
                            case 38:
                                e.preventDefault();

                                $scope.selected--;
                                if($scope.selected < 0)
                                    $scope.selected = $scope.list.length - 1;

                                $scope.attach($scope.selected);
                                break;
                            case 40:
                                e.preventDefault();
                                
                                $scope.selected++;
                                if($scope.selected == $scope.list.length)
                                    $scope.selected = 0;
                                
                                $scope.attach($scope.selected);
                                break;
                            case 13:
                                $scope.list = [];
                                $scope.selected = -1;
                                break;
                        }
                    }

                    $scope.click = function(idx){
                        $scope.attach(idx);
                        $scope.list = []; 
                        $scope.selected = -1;
                    }

                    $scope.search = function(query) {
                        if(!query)
                            return;

                        $q.when($scope.fetch(query), function(value){
                            if(!value) $scope.list = [];
                            $scope.list = value.data || value;
                        }, function(err){
                            $scope.list = [];
                        })                   
                    }
                }]
            }
        })
})();
