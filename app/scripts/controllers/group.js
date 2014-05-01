app.controller("GroupCtrl", function($scope, $routeParams, authService, $modal, $http) {
    
    var endpoint = 'http://tripbox.uab.es/TB_Backend/api/';

    $scope.groupId = $routeParams.groupId;
    $scope.infoUser = authService.data.userInfo;

    $scope.openInviteModal = function() {

        var invitationModalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'InvitationModalInstanceCtrl'
        });

    };

    /*
    <!--Añadir nuevo destino-->
    var destino = "Valladolid";

    $http.put(endpoint + 'group/' + $scope.groupId + '/destination', destino, {
        headers: {
            'Content-Type': 'text/plain'
        }
    })
        .success(function(data, status) {
            console.log("destino insertado");
        }).
    error(function(data, status) {
        console.log("error al insertar");
    });
    */

});

app.controller('InvitationModalInstanceCtrl', function($scope, $modalInstance, ApiService) {
    $scope.users = [];
    $scope.addInvite = function() {
        $scope.users.push($scope.newUser);

        $scope.newUser = '';
    }

    $scope.sendInvitations = function() {
        console.log($scope.users);
        ApiService.sendInvitations($scope.users, 21);
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