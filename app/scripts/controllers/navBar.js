    app.controller('NavBarCtrl', function($scope, facebookAuthService) {
        $scope.leftLinks = [{
            name: 'Groups',
            route: 'groups'
        }, {
            name: 'Profile',
            route: 'profile'
        }];



        $scope.logout = function() {
            facebookAuthService.logout();
        }
    })