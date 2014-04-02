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
      .otherwise({
        redirectTo: '/'
      });
  });