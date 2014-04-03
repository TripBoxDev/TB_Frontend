'use strict';

var FacebookData = {};
FacebookData.channel = 'https://mysite.com/channel.html';
FacebookData.fbAppId = '1567668726791128';

angular.module('angulApp')
    .controller('MainCtrl', function($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    })
    .controller('LoginCtrl', function($scope, $routeParams, authService) {

        $scope.socialNetwork = $routeParams.socialNetwork;

        $scope.data = authService.data;

        $scope.loginFacebook = function() {
            authService.login();
        };
    })

/**
 * Handles authentication with Facebook.
 */
.factory('authService', function($rootScope) {
    var authManagement = {
        data: {
            isLogged: false,
            username: ''
        },
        /**
         * Sends the query to log in to Facebook
         */
        login: function() {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    var uid = response.authResponse.userID;
                }
            }, {
                scope: 'email'
            });
        },
        /**
         * Sends the query to Facebook to retrieve user info
         */
        getUserInfo: function() {

            var _self = this;

            FB.api('/me', function(response) {

                $rootScope.$apply(function() {

                    $rootScope.user = _self.user = response;

                });

            });

        },

        /**
         * Attaches a handler to the event triggered whenever Facebook's auth changes
         */
        watchAuthStatusChange: function() {

            var _self = this;

            FB.Event.subscribe('auth.authResponseChange', function(response) {

                if (response.status === 'connected') {
                    console.log('CONNECTED!');
                    /* 
                     The user is already logged, 
                     is possible retrieve his personal info
                    */
                    _self.getUserInfo();

                    _self.data.isLogged = true;
                    /*
                     This is also the point where you should create a 
                     session for the current user.
                     For this purpose you can use the data inside the 
                     response.authResponse object.
                    */

                } else {

                    _self.data.isLogged = false;

                    /*
                     The user is not logged to the app, or into Facebook:
                     destroy the session on the server.
                    */

                }

            });

        }
    };
    return authManagement;

})
    .run(function($rootScope, authService, $location) {

        $rootScope.user = {};

        (function(d) {
            var js, id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/it_IT/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));

        window.fbAsyncInit = function() {
            FB.init({
                appId: FacebookData.fbAppId, // App ID
                //channelUrl: FacebookData.channel, // Channel File
                status: true, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true // parse XFBML
            });

            authService.watchAuthStatusChange();

        };

        $rootScope.$on('$routeChangeSuccess', function(scope, currRoute, prevRoute) {
            console.dir('CurrView: ' + currRoute);
            console.dir('PrevView: ' + prevRoute);
            console.dir(prevRoute);
            if (!currRoute.isFree && !authService.data.isLogged) {
                if (currRoute.templateUrl !== 'views/main.html') {
                    $location.path('/');
                    console.log('Should be logged in, redirecting to /');
                }
            }
        });

    });