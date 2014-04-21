    app.controller('NavBarCtrl', function($scope, $location, facebookAuthService) {

        $scope.rightLinks = [];

        $scope.rightLinks[] = {
            label: 'Name LastName',
            route: 'profile'
        };
        var splittedRoute$location.path().split('/');
        if(splittedRoute[0] === 'groups' && typeof splittedRoute !== 'undefined') {
            $scope.rightLinks[] = {
                label: 'Invite friends',
                click: 'showInviteFriends'

        }


        $scope.logout = function() {
            facebookAuthService.logout();
        }
    })