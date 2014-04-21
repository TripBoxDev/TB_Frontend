    app.controller('NavBarCtrl', function($scope, $location, facebookAuthService) {

        $scope.rightLinks = [];


        var splittedRoute = $location.path().split('/');

        if (splittedRoute[1] === 'groups' && typeof splittedRoute[2] !== 'undefined') {
            $scope.rightLinks.push({
                label: 'Invite friends',
                click: 'showInviteFriends'
            });

        }

        $scope.rightLinks.push({
            label: 'Name LastName',
            route: 'profile'
        });

        $scope.logout = function() {
            facebookAuthService.logout();
        }
    })