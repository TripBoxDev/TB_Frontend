app.controller("DestinationCtrl", function($scope,$routeParams,  authService, ApiService){

$scope.group={};
$scope.destinationChoosed= $routeParams.destination;
$scope.selectedCard=true;

var getGroup=function(){

	return ApiService.getGroup($routeParams.groupId).success(function(response){

		$scope.group=angular.copy(response);
	});
}

getGroup();


});