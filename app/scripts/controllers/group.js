app.controller("GroupCtrl", function($scope, $routeParams, authService, $modal) {
    $scope.groupId = $routeParams.groupId;
    $scope.infoUser = authService.data.userInfo;

    $scope.openInviteModal = function() {

        var invitationModalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'InvitationModalInstanceCtrl'
        });

    };
});

app.controller('InvitationModalInstanceCtrl', function($scope, $modalInstance, ApiService) {
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
        $modalInstance.close();

    }

    $scope.submit = function() {
    	console.log(this.newUser);
        $scope.users.push({
            mail: this.newUser,
        });

        this.newUser = '';
    }

    /**
     * Elimina un mail de la lista de mails
     */
    $scope.removeUser = function(index) {

        $scope.users.splice(index, 1);
    }


    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});