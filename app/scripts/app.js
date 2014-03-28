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
        templateUrl: 'views/group.html', 
        controller: 'MainCtrl' 
      })
      .otherwise({
        redirectTo: '/'
      });
  });
