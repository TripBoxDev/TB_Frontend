app.controller('LoginCtrl', function($rootScope, $scope, $routeParams, facebookAuthService, $location, authService, ApiService) {

    $scope.loading = false;

    $scope.socialNetwork = $routeParams.socialNetwork;

    $scope.loginFacebook = function() {
        facebookAuthService.login().then(facebookAuthService.getUserInfo, function(error) {
            console.log(error);
        });
    };

    $scope.logout = function() {
        facebookAuthService.logout();
    }
})