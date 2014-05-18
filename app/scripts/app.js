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
                },
                resolve: {
                    checkAccess: checkAccess,

                }
            })
            .when('/groups/:groupId', {
                templateUrl: 'views/group.html',
                controller: 'GroupCtrl',
                access: {
                    isFree: false
                },
                resolve: {
                    checkAccess: checkAccessToGroup,

                }
            })
            .when('/groups/:groupId/invitation/:invitation', {
                templateUrl: 'views/group.html',
                controller: 'ReceiveInvitationCtrl',
                access: {
                    isFree: false
                },
                resolve: {
                    checkAccess: checkAccess
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

/**
 * Serie de promises que controlan si el usuario tiene permisos para ver 
 * la vista restringida. Este método se utiliza en los resolve de las routes
 */
var checkAccess = function(facebookAuthService, ApiService, authService, $location) {
    return facebookAuthService.loadSdk()
        .then(facebookAuthService.getLoginStatus, function() {
            console.log('errrorr!');
        })
        .then(facebookAuthService.getUserInfo, function() {
            authService.setRedirectUrl($location.path());
            ApiService.logoutUser();
            facebookAuthService.watchAuthStatusChange();

            $location.path('/');

        })
        .then(ApiService.loginUser)
        .then(function(apiResponse) {
            authService.data.isLogged = true;
            authService.data.userInfo = apiResponse;

        }, function() {

        });

}

var checkAccessToGroup = function($route, facebookAuthService, ApiService, authService, $location) {
    return facebookAuthService.loadSdk()
        .then(facebookAuthService.getLoginStatus, function() {
            console.log('errrorr!');
        })
        .then(facebookAuthService.getUserInfo, function() {
            authService.setRedirectUrl($location.path());
            ApiService.logoutUser();
            facebookAuthService.watchAuthStatusChange();

            $location.path('/');

        })
        .then(ApiService.loginUser)
        .then(function(apiResponse) {
            authService.data.isLogged = true;
            authService.data.userInfo = apiResponse;
            if(!authService.data.userInfo.groups.contains($route.current.params.groupId)) $location.path('/');

        }, function() {

        });

}

/**
 * Array.prototype.[method name] allows you to define/overwrite an objects method
 * needle is the item you are searching for
 * this is a special variable that refers to "this" instance of an Array.
 * returns true if needle is in the array, and false otherwise
 */
Array.prototype.contains = function ( needle ) {
   var i;
   for (i in this) {
       if (this[i] == needle) return true;
   }
   return false;
}

var app = angular.module('angulApp');