app.controller("GroupCtrl", function($scope, $routeParams, authService, $modal) {
	$scope.groupId = $routeParams.groupId;
	$scope.infoUser = authService.data.userInfo;

});
