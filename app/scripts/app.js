'use strict';

angular.module('angulApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap'
])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'LoginCtrl',
                access: {
                    isFree: true
                }
            })
            .when('/groups', {
                templateUrl: 'views/groups.html',
                controller: 'GroupsCtrl',
                access: {
                    isFree: false
                }
            })
            .when('/groups/:groupId', {
                templateUrl: 'views/group.html',
                controller: 'GroupCtrl',
                access: {
                    isFree: false
                }
            })
            .when('/groups/:groupId/invitation/:invitation', {
                templateUrl: 'views/group.html',

                controller: 'GroupCtrl',
                access: {
                    isFree: false
                }
            })
            .when('/error', {
                templateUrl: 'views/error.html',
                access: {
                    isFree: true
                }
            })
            .otherwise({
                redirectTo: '/',
                access: {
                    isFree: true
                }
            });
    });

var app = angular.module('angulApp');