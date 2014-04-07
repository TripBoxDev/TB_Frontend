'use strict';

var FacebookData = {};
FacebookData.channel = 'https://mysite.com/channel.html';
FacebookData.fbAppId = '1567668726791128';
FacebookData.autoFbLogin = true;

angular.module('angulApp')
    .controller('MainCtrl', function($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    })
    .controller('LoginCtrl', function($scope, $routeParams, facebookAuthService) {

        $scope.socialNetwork = $routeParams.socialNetwork;


        $scope.loginFacebook = function() {
            facebookAuthService.login();
        };
    })

/**
 * Handles authentication with Facebook.
 */
.factory('facebookAuthService', function(ApiService) {
    var authManagement = {
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

                // Prepares object to be sent to API
                var apiData = {
                    //facebookId: response.id,
                    name: response.first_name,
                    lastName: response.last_name,
                    email: response.email
                }


                // Send user info for API approval
                ApiService.loginUser(apiData);

            });

        },

        /**
         * Attaches a handler to the event triggered whenever Facebook's auth changes
         */
        watchAuthStatusChange: function() {

            var _self = this;

            FB.Event.subscribe('auth.authResponseChange', function(response) {

                if (response.status === 'connected') {
                    /* 
                     The user is already logged, 
                     is possible retrieve his personal info
                    */
                    _self.getUserInfo();

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
/**
 * Stores global status of user, like if it is logged or not.
 */
.factory('authService', function() {
    var authManagement = {
        data: {
            isLogged: false
        }

    };
    return authManagement;

})

//PETICION JSON HACIA LA API

//para hacer uso de $resource debemos colocarlo al crear el modulo

//con dataResource inyectamos la factoría
.controller("GroupsCtrl", function($scope) {
    $scope.groups = [{
        id: 1,
        name: 'Miami',
        description: 'País muy bonito pq lo digo yo'
    }, {
        id: 2,
        name: 'Berlin',
        description: 'Me encanta la cerveza negra'
    }, {
        id: 3,
        name: 'Luxenburgo',
        description: 'Aquí se te ha ido de las manos Correa xd'
    }, {
        id: 4,
        name: 'Dublin',
        description: 'Aquí se te ha ido de las manos Correa xd'
    }, {
        id: 5,
        name: 'Amsterdam',
        description: 'Aquí se te ha ido de las manos Correa xd'
    }, {
        id: 6,
        name: 'Japon',
        description: 'Aquí se te ha ido de las manos Correa xd'
    }, {
        id: 7,
        name: 'Hawai',
        description: 'Aquí se te ha ido de las manos Correa xd'
    }];

    $scope.addGroup = function() {
        $scope.groups.push({
            id: 7,
            name: 'Hawai',
            description: 'Aquí se te ha ido de las manos Correa xd'
        });
        console.log($scope.groups);
    }

    $scope.unfollowGroup = function() {
        $scope.groups.pop();
    }
    /*
    //hacemos uso de $http para obtener los datos del json
    $http.get('data.json').success(function(data) {
        //Convert data to array.
        //datos lo tenemos disponible en la vista gracias a $scope
        $scope.datos = data;
    });
    //datosResource lo tenemos disponible en la vista gracias a $scope
    $scope.datosResource = dataResource.get();
    */
})

.factory('ApiService', function($http, $location, authService) {
    return {
        endpoint: 'http://tripbox.uab.cat/TB_Backend/api',
        loginUser: function(data) {
            console.log(data);
            $http.put(this.endpoint + '/user', data)
                .success(function(data, status, headers, config) {
                    // TODO Cambiar isLogged
                    console.log(data);
                    console.log('Logged in successfully');
                    authService.data.isLogged = true;

                    // Redirect to groups
                    $location.path('/groups');



                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.

                    console.log('API returned an error');
                });
        }
    }
})
    .controller('NavBarCtrl', function($scope) {
        $scope.links = [{
            name: 'Groups',
            route: 'groups'
        }, {
            name: 'Profile',
            route: 'profile'
        }, {
            name: 'Log out',
            route: 'logout'
        }];
    })

.run(function($rootScope, facebookAuthService, $location, authService) {

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
            status: FacebookData.autoFbLogin, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true // parse XFBML
        });

        facebookAuthService.watchAuthStatusChange();

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