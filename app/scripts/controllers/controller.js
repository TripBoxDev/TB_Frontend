var app = angular.module('groupApp'),[]);

	app.controller("controller_group", ['$scope', function($scope){

		$scope.groups = [
		    {id:1, name:'Miami'},
		    {id:2, name:'Luxenburgo'},
		    {id:3, name:'Berlin'}
		];
	}
]);
