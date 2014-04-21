    app.controller('NavBarCtrl', function($scope, $location, facebookAuthService) {

        $scope.rightLinks = [];

        function isInsideGroup() {
            var splittedRoute = $location.path().split('/');

            if (splittedRoute[1] === 'groups' && typeof splittedRoute[2] !== 'undefined') {
                return true;

            } else {
                return false;
            }
        }

        if (isInsideGroup()) {
            $scope.rightLinks.push({
                label: 'Invite friends',
                click: 'showInviteFriends'
            });
        }




        $scope.rightLinks.push({
            label: 'Name LastName',
            href: 'profile',
            click: ''
        });

        $scope.logout = function() {
            facebookAuthService.logout();
        }
    })