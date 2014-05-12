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
                    checkAccess: checkAccess
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
                controller: 'ReceiveInvitationCtrl',
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
var checkAccess = function(facebookAuthService, ApiService, authService, $location) {
                        return facebookAuthService.loadSdk()
                            .then(facebookAuthService.getLoginStatus)
                            .then(facebookAuthService.getUserInfo, function() {
                                console.log('getUserInFAIIIIL');
                                ApiService.logoutUser();
                                facebookAuthService.watchAuthStatusChange();
                            })
                            .then(ApiService.loginUser).then(function(apiResponse) {

                                authService.data.isLogged = true;
                                debugger;
                                authService.data.userInfo = apiResponse;

                                $location.path(authService.data.redirectUrl);

                                authService.setIsLogging(false);
                            }, function() {
                                console.log('API ERROR');
                            });

                    }
var app = angular.module('angulApp');