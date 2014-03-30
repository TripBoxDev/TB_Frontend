'use strict';



function ControllerGroups ($scope) {

  $scope.groups = [
    {id:1, name:'Miami'},
    {id:2, name:'Berlin'},
    {id:3, name:'Luxenburgo'}
  ];

}






angular.module('groupApp')

	.controller('ControllerGroup', function ($scope) {

		$scope.groups = [
		    {id:1, name:'Miami'},
		    {id:2, name:'Luxenburgo'},
		    {id:3, name:'Berlin'}
		];
	});