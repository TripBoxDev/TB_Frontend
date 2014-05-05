/**
 * Nombre:          facebookAuthService
 * Descripcion:     Este Service se encarga de controlar la sesión con Facebook.
 *                  Incluye los métodos para escuchar los cambios en el estado de FB,
 *                  obtener información del usuario, etc.
 */

'use strict';

var FacebookData = {};
FacebookData.channel = 'https://mysite.com/channel.html';
FacebookData.fbAppId = '1567668726791128';
FacebookData.autoFbLogin = false;

app.factory('facebookAuthService', function(ApiService, authService, $log) {
    var authManagement = {
        /**
         * Sends the query to log in to Facebook
         */
        login: function(callback) {
            $log.info('Haciendo login en FB');
            authService.setIsLogging(true);

            FB.login(function(response) {
            $log.info('Facebook login response status: ' + response.status);

                if (response.status === 'connected') {
                    /* 
                     The user is already logged, 
                     is possible retrieve his personal info
                    */

                    callback();
                    /*
                     This is also the point where you should create a 
                     session for the current user.
                     For this purpose you can use the data inside the 
                     response.authResponse object.
                    */

                } else {

                    ApiService.logoutUser();

                    /*
                     The user is not logged to the app, or into Facebook:
                     destroy the session on the server.
                    */

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
            $log.info('Suscribe a cambios en estado del Facebook');
            FB.Event.subscribe('auth.authResponseChange', function(response) {
                $log.info('Facebook status change detected: ' + response.status);
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

                    ApiService.logoutUser();

                    /*
                     The user is not logged to the app, or into Facebook:
                     destroy the session on the server.
                    */

                }

            });

        },
        getLoginStatus: function() {
            var _self = this;
            FB.getLoginStatus(function(response) {
                $log.info('Facebook login status: ' + response.status);
                if (response.status === 'unknown') {
                    ApiService.logoutUser();
                    _self.watchAuthStatusChange();
                } else if(response.status === 'connected') {
                    _self.getUserInfo();
                }

            });
        },
        logout: function() {
            var _self = this;
            ApiService.logoutUser();
        }
    };
    return authManagement;

});