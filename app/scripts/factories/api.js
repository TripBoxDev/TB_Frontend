app.factory('ApiService', function($http, $location, authService, ErrorHandler) {
    return {
        endpoint: 'http://tripbox.uab.cat/TB_Backend/api',
        loginUser: function(data) {
            console.log(data);
            $http.put(this.endpoint + '/user', data)
                .success(function(data, status, headers, config) {

                    authService.data.isLogged = true;

                    // Redirect to groups
                    $location.path('/groups');



                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.

                    console.log('API returned an error');
                    ErrorHandler.redirectError();
                });
        },
        logoutUser: function() {
            authService.data.isLogged = false;
            $location.path('/');


        }
    }
})