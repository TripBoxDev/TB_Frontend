app.controller('LoginCtrl', function($rootScope, $scope, $routeParams, facebookAuthService, $location, authService, ApiService) {

    $scope.loading = false;

    $scope.socialNetwork = $routeParams.socialNetwork;

    $scope.loginFacebook = function() {

        facebookAuthService.login()
            .then(facebookAuthService.getUserInfo, function(error) {
                console.log(error);
            })
            .then(ApiService.loginUser).then(function(apiResponse) {
                authService.data.isLogged = true;
                authService.data.userInfo = apiResponse;

                $location.path(authService.getRedirectUrl());

            }, function() {

            });

    };

    $scope.logout = function() {
        facebookAuthService.logout();
    }
})