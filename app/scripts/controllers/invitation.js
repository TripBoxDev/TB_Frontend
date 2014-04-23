app.controller('InvitationCtrl', function($scope, ApiService) {
    $scope.users = [];
    $scope.addInvite = function() {
        $scope.users.push({
            mail: $scope.newUser,
        });
    }

    $scope.sendInvitations = function() {
        console.log($scope.users);
    	ApiService.sendInvitations($scope.users);
    }

})