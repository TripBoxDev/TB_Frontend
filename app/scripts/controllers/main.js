'use strict';

angular.module('angulApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
  .controller('LoginCtrl', function ($scope, $routeParams, $http, authService) {
    $scope.socialNetwork = $routeParams.socialNetwork;

    $scope.dato = authService.data;
    //$scope.dato = authService.data;
    $scope.login = function(){
        // De pegote
        var config = {
          method : 'GET',
          url: '/'
        };

        $http(config)
          .success(function(data, status, headers, config) {
            console.log(status === 200);
            if (status === 200) {
              // succefull login
              authService.data.isLogged = true;
              authService.data.username = data.username;
              console.log(authService.data.isLogged);
            } else {
              authService.data.isLogged = false;
              authService.data.username = '';
              console.log(authService.data.isLogged);
            }
            $scope.dato = authService.data;

          })
          .error(function(data, status, headers, config) {
            authService.data.isLogged = false;
            authService.data.username = '';
            console.log(authService.data.isLogged);
            $scope.dato = authService.data;

          });


      }
  })
  .factory('authService', function() {
    var authManagement = {
      data: {
        isLogged : false,
        username : ''
      }
      
    };
    return authManagement;
 
  });
