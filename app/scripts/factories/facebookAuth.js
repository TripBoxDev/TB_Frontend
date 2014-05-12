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

app.factory('facebookAuthService', function(ApiService, authService, $log, $q) {
    var authManagement = {

        loadSdk: function() {
            
            debugger;
            var deferred = $q.defer();

            if(typeof FB === "undefined") {
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

                    $log.info('Carga SDK Facebook, autoFbLogin: ' + FacebookData.autoFbLogin);
                    FB.init({
                        appId: FacebookData.fbAppId, // App ID
                        //channelUrl: FacebookData.channel, // Channel File
                        status: false, // check login status
                        cookie: true, // enable cookies to allow the server to access the session
                        xfbml: true // parse XFBML
                    });
                                deferred.resolve();

                };
            } else {
                deferred.resolve();
            } 

            return deferred.promise;
        },
        /**
         * Sends the query to log in to Facebook
         */
        login: function(callback) {
            var deferred = $q.defer();
            $log.info('Haciendo login en FB');
            authService.setIsLogging(true);

            FB.login(function(response) {
                $log.info('Facebook login response status: ' + response.status);
                if (response.status === 'connected') {
                    debugger;
                    /*
                     The user is already logged, 
                     is possible retrieve his personal info
                    */

                    deferred.resolve();
                    /*
                     This is also the point where you should create a 
                     session for the current user.
                     For this purpose you can use the data inside the 
                     response.authResponse object.
                    */

                } else {
debugger;
                    deferred.reject(response);

                    /*
                     The user is not logged to the app, or into Facebook:
                     destroy the session on the server.
                    */

                }

            }, {
                scope: 'email'
            });
            return deferred.promise;
        },
        /**
         * Sends the query to Facebook to retrieve user info
         */
        getUserInfo: function() {
            debugger;
            var deferred = $q.defer();
            var _self = this;

            FB.api('/me', function(response) {
                debugger;
                // Prepares object to be sent to API
                var apiData = {
                    //facebookId: response.id,
                    name: response.first_name,
                    lastName: response.last_name,
                    email: response.email
                }
                deferred.resolve(apiData);
            });

            return deferred.promise;

        },

        /**
         * Attaches a handler to the event triggered whenever Facebook's auth changes
         */
        watchAuthStatusChange: function() {

            debugger;
            var _self = this;
            $log.info('Suscribe a cambios en estado del Facebook');
            FB.Event.subscribe('auth.authResponseChange', function(response) {
                $log.info('Facebook status change detected: ' + response.status);
                if (response.status === 'connected') {
                    /* 
                     The user is already logged, 
                     is possible retrieve his personal info
                    */
                    $log.info('Get user info inside watchAuthStatusChange');
                    if (authService.data.userInfo === {}) _self.getUserInfo();

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
            var deferred = $q.defer();
            debugger;
            var _self = this;
            FB.getLoginStatus(function(response) {
                $log.info('Facebook login status: ' + response.status);
                if (response.status === 'unknown') {
                    
                    deferred.reject();
                } else if (response.status === 'connected') {
                    deferred.resolve();
                }

            });

            return deferred.promise;
        },
        logout: function() {
            var _self = this;
            ApiService.logoutUser();
        }
    };
    return authManagement;

});