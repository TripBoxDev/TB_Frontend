app.controller('LoginCtrl', function($scope, $routeParams, facebookAuthService) {

        $scope.socialNetwork = $routeParams.socialNetwork;


        $scope.loginFacebook = function() {
            facebookAuthService.login();
        };

        $scope.logout = function() {
            facebookAuthService.logout();
        }
    })