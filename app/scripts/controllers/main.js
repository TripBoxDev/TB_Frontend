'use strict';

angular.module('angulApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
  .controller('LoginCtrl', function ($scope, $routeParams) {
   	$scope.socialNetwork = $routeParams.socialNetwork;
  });
