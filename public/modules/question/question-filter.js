(function(){
	'use strict';

	angular.module('CustomFilter', [])
		.filter('cutQuestion', function(){
			return function(input) {
				if(input.length > 80){
					input = input.slice(0, 77)+'...';
				}

				return input;
			}
		})
		.filter('cutTags', function(){
			return function(tags){

				if(!tags){
					return [];
				}

				//120 - 80 = 40
				//20
				var res = [];
				var LENGTH = 20;
				var l = 0;
				for(var i = 0; i < tags.length; ++i){
					if(l + tags[i].length < LENGTH){
						res.push(tags[i]);
						l += tags[i].length;
					}else{
						res.push('...');
						break;
					}
				}

				return res;
			}
		})
})()