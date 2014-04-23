app.controller('InvitationCtrl', function($scope) {
    $scope.users = [{
        texto: '',
    }];
    $scope.addInvite = function() {
        $scope.users.push({
            texto: $scope.newuser,
        });
    }

})