app.controller("GroupCtrl", function($scope, $routeParams, authService, $modal, ApiService) {

    $scope.groupId = $routeParams.groupId;
    $scope.infoUser = authService.data.userInfo;

    if($routeParams.invitation) {
        ApiService.addUserToGroup($scope.groupId);
    }
    $scope.logoutUser = ApiService.logoutUser;
    $scope.openInviteModal = function() {

        var invitationModalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'InvitationModalInstanceCtrl'
        });

    };
});

app.controller('InvitationModalInstanceCtrl', function($scope, $modalInstance, ApiService, $routeParams) {
    $scope.users = [];
    $scope.addInvite = function() {
        $scope.users.push($scope.newUser);

        $scope.newUser = '';
    }

    $scope.sendInvitations = function() {
        console.log($scope.users);
        ApiService.sendInvitations($scope.users, $routeParams.groupId);
        $modalInstance.close();

    }

    $scope.submit = function() {

        $scope.users.push(this.newUser);

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