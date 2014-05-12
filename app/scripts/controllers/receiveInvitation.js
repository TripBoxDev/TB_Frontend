/**
 * Nombre:          ReceiveInvitationCtrl
 * Descripcion:  	Controller encargado de recibir los usuarios que vengan de una invitación
 * 					por email. Añade el usuario al grupo, y el grupo al usuario, después redirecciona
 *					a la vista de grupos normal.
 */
app.controller("ReceiveInvitationCtrl", function($scope, $routeParams, ApiService, $log, $location) {
    $log.info('Inside receiveInvitationCtrl');
    if ($routeParams.invitation) {
        ApiService.addUserToGroup($routeParams.groupId)
        .success(function(data) {
            $location.path('groups/' + $routeParams.groupId);
        })
        .error(function(data) {
        	$log.error('data');
        });
    }
});