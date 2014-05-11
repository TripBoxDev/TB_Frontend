app.controller("DestinationCtrl", function($scope,$routeParams,  authService, ApiService){

$scope.group={};
$scope.destinationChoosed= $routeParams.destination;

var getGroup=function(){

	return ApiService.getGroup($routeParams.groupId).success(function(response){
console.log(response);
		$scope.group=angular.copy(response);
	});
}

getGroup();
});