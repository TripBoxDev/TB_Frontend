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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        access: {
          isFree : true
        }
      })
      .when('/Login/:socialNetwork', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        access: {
          isFree : true
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
