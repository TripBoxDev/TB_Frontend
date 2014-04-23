app.controller('InvitationCtrl', function($scope, apiService) {
    $scope.users = [{
        texto: '',
    }];
    $scope.addInvite = function() {
        $scope.users.push({
            texto: $scope.newuser,
        });
    }

    $scope.sendInvite = function() {
    	apiService.sendInvitations($scope.users);
    }

})