(function(){
	angular.module('main')
		.directive('questionDetail', function(){
			return {
				restrict:'E',
				scope:{
					questionData: '=data'
				},
				templateUrl:'/modules/question/question-detail.html'
			};
		})
})()