app.controller('InvitationCtrl', function($scope, ApiService) {
    $scope.users = [];
    $scope.addInvite = function() {
        $scope.users.push({
            mail: $scope.newUser,
        });

        $scope.newUser = '';
    }

    $scope.sendInvitations = function() {
        console.log($scope.users);
        ApiService.sendInvitations($scope.users);
    }

    /**
     * Elimina un mail de la lista de mails
     */
    $scope.removeUser = function(index) {

        console.log(index);
                $scope.users.splice(index, 1);
    }

})