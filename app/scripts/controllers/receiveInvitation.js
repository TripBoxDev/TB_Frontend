app.controller("ReceiveInvitationCtrl", function($scope, $routeParams, ApiService, $log, $location) {
    $log.info('Inside receiveInvitationCtrl');
    if ($routeParams.invitation) {
        ApiService.addUserToGroup($routeParams.groupId).then(function() {
            $location.path('groups/' + $routeParams.groupId);
        });

    }
});