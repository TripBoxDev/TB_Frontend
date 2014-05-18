app.controller("DestinationCtrl", function($scope,$routeParams,  authService, ApiService){

$scope.group={};
$scope.destinationChoosed= $routeParams.destination;
$scope.selectedCards=[];
$scope.mapSelectedIds={};
$scope.anySelect=false;
$scope.cardsToLink=[];
$scope.linkingToTransport=false;
$scope.linkingToPlace=false;
$scope.onFlow=false;
$scope.cardStartLink={};

//utilitzar service per agafar el grup
var getGroup=function(){

	return ApiService.getGroup($routeParams.groupId).success(function(response){

		$scope.group=angular.copy(response);
	});
}

var putPlaceToCard=function(card){
	return ApiService.putPlaceToSleepCard($routeParams.groupId, card).success(function(response){
		
	});
}

getGroup();


$scope.isRemarc = function(id){
	var result =$scope.mapSelectedIds[id];
return $scope.mapSelectedIds[id];
};

$scope.cardTransportSelected =function(cardSelected){
	

	$scope.mapSelectedIds={};

	if(!$scope.anySelect){
		 angular.forEach($scope.group.transportCards, function(card){
	      		if(!angular.equals(card.cardId,cardSelected.cardId)){
	      			$scope.mapSelectedIds[card.cardId]="opac";
	      		}
	     });
	     angular.forEach($scope.group.placeToSleepCards, function(card){
	     	var find=false;
	      	var count=0
	      		while(count<cardSelected.childCardsId.length && !find){
		      		if(angular.equals(cardSelected.childCardsId[count],card.cardId)){
		      			find=true;
		      		}
		      		count+=1;
	     		}
	     		if(!find){
	     			$scope.mapSelectedIds[card.cardId]="opac";
	     		}
	     });
	    $scope.anySelect=true;

	 }else{
	 	$scope.anySelect=false;
	 }

};

$scope.cardPlaceToSelected =function(cardSelected){
	

	$scope.mapSelectedIds={};

	if(!$scope.anySelect){
		 angular.forEach($scope.group.placeToSleepCards, function(card){
	      		if(!angular.equals(card.cardId,cardSelected.cardId)){
	      			$scope.mapSelectedIds[card.cardId]="opac";
	      		}
	     });
	     angular.forEach($scope.group.transportCards, function(card){
	     	var find=false;
	      	var count=0
	      		while(count<cardSelected.parentCardIds.length && !find){
		      		if(angular.equals(cardSelected.parentCardIds[count],card.cardId)){
		      			find=true;
		      		}
		      		count+=1;
	     		}
	     		if(!find){
	     			$scope.mapSelectedIds[card.cardId]="opac";
	     		}
	     });
	    $scope.anySelect=true;
	 }else{
	 	$scope.anySelect=false;
	 }

};

$scope.startLink=function(card){
	$scope.cardStartLink=card;
	$scope.cardsToLink.push(card);
	$scope.mapSelectedIds={};

	if(angular.equals(card.cardType, "transport")){
		 angular.forEach($scope.group.transportCards, function(transCard){
	      		if(!angular.equals(transCard.cardId,card.cardId)){
	      			$scope.mapSelectedIds[transCard.cardId]="opac";
	      		}
	     });
		$scope.linkingToPlace=true;
	}
	if(angular.equals(card.cardType, "placeToSleep")){
		angular.forEach($scope.group.placeToSleepCards, function(placeCard){
	      		if(!angular.equals(placeCard.cardId,card.cardId)){
	      			$scope.mapSelectedIds[placeCard.cardId]="opac";
	      		}
	     });
		$scope.linkingToTransport=true;
	}

};
$scope.endLink=function(card){
	var placeToCard={}
	if(angular.equals(card.cardType, "transport")){
		placeToCard = angular.copy($scope.cardStartLink);
		placeToCard.parentCardIds.push(card.cardId);
	}else{
		placeToCard = angular.copy(card);
		placeToCard.parentCardIds.push($scope.cardStartLink.cardId);
	}
	putPlaceToCard(placeToCard);

	resetStat();
};
$scope.cancelLink = function(){
resetStat();
};
var resetStat = function(){
		$scope.mapSelectedIds={};
		$scope.linkingToTransport=false;
		$scope.linkingToPlace=false;
		$scope.anySelect=false;
		$scope.cardStartLink={};
}
$scope.isCardStartLink = function(card){
	try{

		if(angular.equals($scope.cardStartLink.cardId, card.cardId)) return true;
	}catch(error){
		return false;
	}
	

};

// $('body').on('click', function (e) {
// 		console.log(e);
// 		if($scope.anySelect || $scope.linkingToTransport || $scope.linkingToPlace){
// 			$scope.mapSelectedIds={};
// 			$scope.linkingToTransport=false;
// 			$scope.linkingToPlace=false;
// 			$scope.anySelect=false;
// 			//$scope.$apply();
// 		}	
// });

});