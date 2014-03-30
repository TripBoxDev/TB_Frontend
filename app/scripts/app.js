'use strict';

angular.module('angulApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/groups.html', 
        controller: 'MainCtrl' 
      })
      .otherwise({
        redirectTo: '/'
      });
  });
