app.controller('LoginCtrl', function($rootScope, $scope, $routeParams, facebookAuthService) {

		$scope.loading = false;

        $scope.socialNetwork = $routeParams.socialNetwork;

        $scope.loginFacebook = function() {
        	$scope.loading = true;
            facebookAuthService.login(facebookAuthService.getUserInfo);
        };

        $scope.logout = function() {
            facebookAuthService.logout();
        }
    })