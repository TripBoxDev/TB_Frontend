'use strict';

var FacebookData = {};
FacebookData.channel = 'https://mysite.com/channel.html';
FacebookData.fbAppId = '1567668726791128';
FacebookData.autoFbLogin = true;

app.factory('facebookAuthService', function(ApiService) {
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

                    ApiService.logoutUser();

                    /*
                     The user is not logged to the app, or into Facebook:
                     destroy the session on the server.
                    */

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