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
    .controller('LoginCtrl', function($scope, $routeParams, $http, authService) {
        $scope.socialNetwork = $routeParams.socialNetwork;

        $scope.data = authService.data;

        $scope.login = function() {
            // De pegote
            var config = {
                method: 'GET',
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
                    $scope.data = authService.data;

                })
                .error(function(data, status, headers, config) {
                    authService.data.isLogged = false;
                    authService.data.username = '';
                    console.log(authService.data.isLogged);
                    $scope.data = authService.data;

                });
        }
    })
    .factory('authService', function() {
        var authManagement = {
            data: {
                isLogged: false,
                username: ''
            }

        };
        return authManagement;

    })
    .factory('Facebook', function() {
        function fbLogin(callback) {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    var uid = response.authResponse.userID;
                    callback(response.authResponse);
                }
            }, {
                scope: 'email'
            });
        }
        return {
            fbLogin: fbLogin
        }
    })
    .run(function($rootScope, authService, Facebook) {
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
                $rootScope.fbLogin = Facebook.fbLogin;
            };

            $rootScope.$on('$routeChangeStart', function(scope, currRoute, prevRoute) {
                console.dir('CurrView: ' + currRoute);
                console.dir('PrevView: ' + prevRoute);
                if (!authService.data.isLogged) {
                    console.log('NOT LOGGED IN');

                } else {
                    console.log('logged in! :)');
                }
            });
        }
    );