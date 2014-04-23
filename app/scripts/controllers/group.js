app.controller("GroupCtrl", function($scope, $routeParams, authService) {
	$scope.groupId = $routeParams.groupId;
	$scope.infoUser = authService.data.userInfo;
});
