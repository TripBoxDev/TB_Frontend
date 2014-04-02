'use strict';
angular.module('angulApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/groups', {
        templateUrl: 'views/groups.html', 
        controller: 'GroupsCtrl' 
      })
      .when('/Login/:socialNetwork', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
