app.controller("GroupCtrl", function($rootScope,$scope, $routeParams, $location, authService, $modal, $http, ApiService, $log, notificationFactory, groupService,destiSelectedService) {

    if(!authService.data.userInfo.groups.contains($routeParams.groupId)) $location.path('/');
    var endpoint = 'http://tripbox.uab.es/TB_Backend/api/';

    $scope.groupId = $routeParams.groupId;
    $scope.infoUser = authService.data.userInfo;

    if ($routeParams.invitation) {
        ApiService.addUserToGroup($scope.groupId);
    }
    $scope.logoutUser = ApiService.logoutUser;
    $scope.openInviteModal = function() {
        var invitationModalInstance = $modal.open({
            templateUrl: '/views/modals/sendInvitations.html',
            controller: 'InvitationModalInstanceCtrl'
        });
    };

    $scope.openCreateCardModal = function() {
        var invitationModalInstance = $modal.open({
            templateUrl: '/views/modals/createCard.html',
            controller: 'CreateCardModalInstanceCtrl'
        });

        invitationModalInstance.result.then(function(typeSelected) {
            $rootScope.openCreateTypeCardModal(typeSelected);
        });

    };
    $scope.destinationSelected=false;
    //Recibe que tipo de card se quiere crear y muestra el modal asociado

    $rootScope.openCreateTypeCardModal = function(typeSelected) {
        switch (typeSelected) {
            case 'transport':
                $log.info('Transport has been chosen');

                var createTransportCardModalInstanceCtrl = $modal.open({
                    templateUrl: '/views/modals/addTransportCard.html',
                    controller: 'CreateTransportCardModalInstanceCtrl',
                    resolve: {
                        transports: function() {
                            return $scope.infoGroup.transportCards;
                        },
                        destinations: function() {
                            return $scope.infoGroup.destinations;
                        },
                        infoUser: function() {
                            return $scope.infoUser;
                        }
                    }
                });

                createTransportCardModalInstanceCtrl.result.then(function(newCardReturned) {
                    $scope.infoGroup.transportCards.push(newCardReturned);
                    groupService.setGroup($scope.infoGroup);
                    notificationFactory.success('Nueva card de transporte añadida con éxito!');
                }, function() {
                    // TODO Muestra notificación de error.
                })
                break;
            case 'place2sleep':
                var createPlace2SleepCardModalInstanceCtrl = $modal.open({
                    templateUrl: '/views/modals/addPlace2SleepCard.html',
                    controller: 'CreatePlace2SleepCardModalInstanceCtrl',
                    resolve: {
                        placeToSleepCards: function() {
                            return $scope.infoGroup.placeToSleepCards;
                        },
                        destinations: function() {
                            return $scope.infoGroup.destinations;
                        },
                        infoUser: function() {
                            return $scope.infoUser;
                        }
                    }
                });

                createPlace2SleepCardModalInstanceCtrl.result.then(function(newCardReturned) {
                    $scope.infoGroup.placeToSleepCards.push(newCardReturned);
                    groupService.setGroup($scope.infoGroup);
                    notificationFactory.success('Nueva card de alojamiento añadida con éxito!');


                }, function() {
                    // TODO Muestra notificación de error
                })
                $log.info('place2sleep has been chosen');

                break;
            case 'other':
                var createOtherCardModalInstanceCtrl = $modal.open({
                    templateUrl: '/views/modals/addOtherCard.html',
                    controller: 'CreateOtherCardModalInstanceCtrl',
                    resolve: {
                        destinations: function() {
                            return $scope.infoGroup.destinations;
                        },
                        infoUser: function() {
                            return $scope.infoUser;
                        }
                    }
                });

                createOtherCardModalInstanceCtrl.result.then(function(newCardReturned) {
                    $scope.infoGroup.otherCards.push(newCardReturned);
                    groupService.setGroup($scope.infoGroup);
                    notificationFactory.success('Nueva card añadida con éxito!');


                }, function() {
                    // TODO Muestra notificación de error
                })
                $log.info('other has been chosen');
                break;
            default:
                $log.error('Invalid card type selected. It must be transport, place2sleep or other.');
        }
    }

    //Leer información del grupo

    $scope.infoGroup = {};

    var getGroup = function() {
        return ApiService.getGroup($scope.groupId).success(function(response) {
            $scope.infoGroup = angular.copy(response);
            groupService.setGroup(response);

        });
    }

    getGroup();


    //Voting

    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
    };

    $scope.putVote = function(cardId, rate, cardType) {

        var newVote = {
            "userId": $scope.infoUser.id,
            "value": rate
        }

        return ApiService.putVote(cardId, newVote).success(function(response) {
            
            var arrayCard;
            if (cardType == 'placeToSleep') {
                arrayCard = $scope.infoGroup.placeToSleepCards;
            } else if (cardType == 'transport') {
                arrayCard = $scope.infoGroup.transportCards;
            } else {
                arrayCard = $scope.infoGroup.otherCards;
            }

            for (var i = arrayCard.length - 1; i >= 0; i--) {
                console.log(arrayCard.length);
                if (arrayCard[i].cardId == cardId) {
                    arrayCard.splice(i, 1);
                    arrayCard.push(response);
                }
            }

            groupService.setGroup($scope.infoGroup);
        });
    }

    $scope.closeAlert = function() {
        $scope.alertDestinationRepeat = false;
    };

    $scope.hoveringLeave = function(rate){
        $scope.myVote = rate;
        console.log($scope.myVote);
    };
    // <!--Añadir place to sleep de forma manual-->

    // var newPlaceToSleep = {
    //     cardType: "placeToSleep",
    //     destination: "Barcelona",
    //     userIdCreator: $scope.infoUser.id
    // }

    // $http.put(endpoint + 'group/' + $scope.groupId + '/placeToSleepCard', newPlaceToSleep)
    //     .success(function(data, status) {
    //         console.log("place to sleep insertado");
    //         $scope.infoGroup.placeToSleepCards.push(newPlaceToSleep);

    //     }).
    // error(function(data, status) {
    //     console.log("error al insertar place to sleep");
    // });

    //click destino
    $scope.destiClicked = function(destino){
        destiSelectedService.setDesti(destino);
        $scope.destinationChoosed1=destiSelectedService.getDesti();
        if($scope.destinationSelected==true){
            $scope.destinationSelected=false;
           
        }else{
            $scope.destinationSelected=true;
            $rootScope.resetDesti();
            
        }
        
        

    }

    //Borrar destino

    $scope.deleteDestination = function(idDest) {
        console.log(idDest);
        return ApiService.deleteDestination(idDest).success(function(response) {
            for (var i = $scope.infoGroup.destinations.length - 1; i >= 0; i--) {
                if ($scope.infoGroup.destinations[i].id == idDest) {
                    $scope.infoGroup.destinations.splice(i, 1);
                }
            }
            groupService.setGroup($scope.infoGroup);
        });
    }

    


    /*
    $scope.deleteDestination = function(destino) {

        $http.delete(endpoint + 'group/' + $scope.groupId + '/destination/', destino, {
            headers: {
                'Content-Type': 'text/plain'
            }
        })
            .success(function(data, status) {
                console.log(data);
                for (var i = $scope.infoGroup.destinations.length - 1; i >= 0; i--) {
                    //Uno cuya id sea igual al borrado...
                    if ($scope.infoGroup.destinations[i] == destino) {
                        //Y lo elimina de la lista
                        $scope.infoGroup.destinations.splice(i, 1);
                    }
                }
            })
            .error(function(data, status) {
                console.log(data);
            });
    };
    */


    /**
     * Abre el modal para añadir un nuevo destino
     */
    $scope.openAddDestinationModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/createDestination.html',
            controller: 'addDestinationModalInstanceCtrl'

        });

        modalInstance.result.then(function(destination) {

            $scope.infoGroup.destinations.push(destination);
            groupService.setGroup($scope.infoGroup);

        });
    }

     $scope.deleteCard = function(card){
        $scope.cartaId= card;
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/deleteCard.html',
            controller: 'deleteCardInstanceCtrl'
        });

        modalInstance.result.then(function() {
             ApiService.deleteCard($scope.infoGroup.id, $scope.cartaId.cardId).success(function(data, status) {
            $scope.infoGroup= getGroup();
            groupService.setGroup($scope.infoGroup);
        }); 
        });

    }

});

app.controller('InvitationModalInstanceCtrl', function($scope, $modalInstance, ApiService, $routeParams, notificationFactory) {
    $scope.users = [];
    $scope.isSending = false;
    $scope.addInvite = function() {
        $scope.users.push($scope.newUser);

        $scope.newUser = '';
    }

    $scope.sendInvitations = function() {
        console.log($scope.users);
        $scope.isSending = true;
        ApiService.sendInvitations($scope.users, $routeParams.groupId)
            .success(function() {
                notificationFactory.success('Se han invitado a tus amigos.');
                $scope.isSending = false;
                $modalInstance.close();
            });




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
    $scope.checkUsers = function() {
        console.log()
        return ($scope.users.length === 0) ? true : false;

    };
});

app.controller('addDestinationModalInstanceCtrl', function($scope, $modalInstance, authService, $http, $routeParams, ApiService, groupService) {

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }
    var destinations = groupService.getGroup().destinations,
        endpoint = 'http://tripbox.uab.es/TB_Backend/api/',
        groupId = $routeParams.groupId;

    $scope.isLoading = false;

    $scope.destino = '';
    $scope.addDestination = function(destino) {
        console.log('inside addDestination');
        $scope.alertDestinationRepeat = false;


        if (!$scope.destinationExists(destino)) {

            /*
            $http.put(endpoint + 'group/' + groupId + '/destination', destino, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
            */
            ApiService.putDestination(destino)
                .success(function(data, status) {
                    var newDestination = {
                        id: data.id,
                        name: data.name,
                        percentage: data.percentage
                    }
                    console.log("destino insertado");
                    // TODO Añadir destino a la lista de arrays, cuando authService user info esté arreglad
                    //destinations.push(destino);
                    $modalInstance.close(newDestination);
                }).
            error(function(data, status) {
                console.log("error al insertar destino");
            });
        } else {
            $modalInstance.dismiss();
            $scope.alertDestinationRepeat = true;
        }

    };

    $scope.destinationExists = function(destination) {
       
        for (var x in destinations) {
            
            if (destinations[x].name === destination){
                
                return true;
            }
}
       
        return false;
    }
});
app.controller('deleteCardInstanceCtrl', function($scope, $modalInstance, authService, $http, $routeParams, ApiService, groupService) {

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }
    

    $scope.confirmDeleteCard = function() {
        $modalInstance.close();

    }
});
/**
 * Controlador de la instancia del modal para crear nuevas cards
 */
app.controller('CreateCardModalInstanceCtrl', function($scope, $modalInstance) {

    /**
     * Cierra el modal de crear carta y envia la eleccion al
     * controlador principal.
     */
    $scope.chooseTypeOfCard = function(type) {
        $modalInstance.close(type);
    }

    /**
     * Cierra el modal actual abortando la acción
     */
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');

    }
});

/**
 * Gestiona la información del modal para crear una card de transporte
 */
app.controller('CreateTransportCardModalInstanceCtrl', function($scope, $modalInstance, $modal, $routeParams, ApiService, authService, transports, destinations, infoUser,destiSelectedService) {
    $scope.isCreatingCard = false;
    $scope.destinations = destinations.filter(function(v) {
        return v !== ''
    });
    $scope.infoUser = infoUser;
    $scope.transportTypes = ['Autobús', 'Avión', 'Barco', 'Coche', 'Tren', 'Otro'];
    $scope.transportType = $scope.transportTypes[0];
    $scope.destiSelected=destiSelectedService.getDesti();

    $scope.ifDesti = function(){

        if($scope.destiSelected==null){
            return false;
        }else{
            console.log($scope.destiSelected.name);
            return true;
        }
    }

    $scope.openAddDestinationModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/createDestination.html',
            controller: 'addDestinationModalInstanceCtrl'

        });

        modalInstance.result.then(function(destino) {
            $scope.destinations.push(destino);
        })
    }

    /**
     * Cierra el modal actual abortando la acción
     */
    $scope.cancel = function() {
        $modalInstance.dismiss();
    }

    $scope.config = {
        create: true,
        maxItems: 1
    }

    /**
     * Envia a la API los datos de la nueva card creada, a partir del formulario rellenado.
     * Si la API retorna OK, cierra el modal y envia el resultado al group ctrl.
     * Si hay error, cierra el modal diciendo que ha ido mal
     */
    $scope.addCardTransport = function(submittedCard) {

        /**
         * Indica si se esta a la espera de la respuesta
         * de la llamada AJAX a la API para crear la card.
         */
        $scope.isCreatingCard = true;

         var init = new Date (submittedCard.initDate);
        var fina = new Date (submittedCard.finalDate);
        /**
         * Card que será enviada a la API
         */

        var newCard = {
            cardType: "transport",
            name: submittedCard.name,
            description: submittedCard.description,
            link: submittedCard.link,
            price: submittedCard.price,
            destination: submittedCard.destination,
            userIdCreator: $scope.infoUser.id,
            nameCreator: $scope.infoUser.name,
            lastNameCreator: $scope.infoUser.lastName,
            initDate: init.valueOf(),
            finalDate: fina.valueOf(),
            transportType: submittedCard.transportType
        }

        ApiService.putTransportCard($routeParams.groupId, newCard)
            .success(function(data, status) {

                var newCardReturn = {
                    cardId: data.cardId,
                    creationDate: data.creationDate,
                    cardType: data.cardType,
                    name: data.name,
                    description: data.description,
                    link: data.link,
                    price: data.price,
                    destination: data.destination,
                    userIdCreator: data.userIdCreator,
                    nameCreator: data.nameCreator,
                    lastNameCreator: data.lastNameCreator,
                    initDate: data.initDate,
                    finalDate: data.finalDate,
                    transportType: data.transportType
                }

                console.log("Card de tipus Transport Card creada");
                $scope.isCreatingCard = false;
                $modalInstance.close(newCardReturn)

            })

        .error(function(data, status) {
            console.log("Error al insertar Transport Card!");
            $modalInstance.dismiss();

        });

    };
});

/**
 * Gestiona la información del modal para crear una card de transporte
 */
app.controller('CreatePlace2SleepCardModalInstanceCtrl', function($scope, $modalInstance, $modal, $routeParams, ApiService, placeToSleepCards, destinations, infoUser,destiSelectedService) {
    $scope.isCreatingCard = false;
    $scope.destinations = destinations;
    $scope.infoUser = infoUser;
    $scope.placeTypes = ['Apartamento', 'Cámping', 'Couchsurfing', 'Hotel', 'Modo Aventura', 'Refugio', 'Otro'];
    $scope.placeType = $scope.placeTypes[0];
$scope.destiSelected=destiSelectedService.getDesti();

    $scope.ifDesti = function(){

        if($scope.destiSelected==null){
            return false;
        }else{
            console.log($scope.destiSelected.name);
            return true;
        }
    }
    $scope.openAddDestinationModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/createDestination.html',
            controller: 'addDestinationModalInstanceCtrl'

        });

        modalInstance.result.then(function(destino) {
            $scope.destinations.push(destino);
        })
    }
    /**
     * Cierra el modal actual abortando la acción
     */
    $scope.cancel = function() {
        $modalInstance.dismiss();
    }

    $scope.addCardPlaceToSleep = function(submittedCard) {

        $scope.isCreatingCard = true;
        var init = new Date (submittedCard.initDate);
        var fina = new Date (submittedCard.finalDate);
        // Todo obtener parentCardIds de la card, en caso de estar modificandola.
        var parentCardIds = [];
        if (typeof submittedCard.parentCardId !== "undefined") parentCardIds.push(submittedCard.parentCardId);
        var newCard = {
            parentCardIds: parentCardIds,
            cardType: "placeToSleep",
            name: submittedCard.name,
            description: submittedCard.description,
            link: submittedCard.link,
            price: submittedCard.price,
            destination: submittedCard.destination,
            userIdCreator: $scope.infoUser.id,
            nameCreator: $scope.infoUser.name,
            lastNameCreator: $scope.infoUser.lastName,
            initDate: init.valueOf(),
            finalDate: fina.valueOf(),
            placeType: submittedCard.type
        }
 

        ApiService.putPlaceToSleepCard($routeParams.groupId, newCard)
            .success(function(data, status) {

                var newCardReturn = {
                    parentCardIds: data.parentCardIds,
                    cardId: data.cardId,
                    creationDate: data.creationDate,
                    cardType: data.cardType,
                    name: data.name,
                    description: data.description,
                    link: data.link,
                    price: data.price,
                    destination: data.destination,
                    userIdCreator: data.userIdCreator,
                    nameCreator: data.nameCreator,
                    lastNameCreator: data.lastNameCreator,
                    initDate: data.initDate,
                    finalDate: data.finalDate,
                    placeType: data.placeType
                }

                console.log("Card de tipus placeToSleep Card creada");
                console.log(newCardReturn.parentCardIds);
                $modalInstance.close(newCardReturn);
                //$scope.infoGroup.placeToSleepCards.push(newCardReturn);
            })
            .error(function(data, status) {
                console.log("Error al insertar placeToSleepCard!");
                $modalInstance.dismiss();
            });
    }
});

/**
 * Gestiona la información del modal para crear una card de transporte
 */
app.controller('CreateOtherCardModalInstanceCtrl', function($scope, $modalInstance, $modal, $routeParams, ApiService, destinations, infoUser,destiSelectedService) {
    $scope.isCreatingCard = false;
    $scope.destinations = destinations;
    $scope.infoUser = infoUser;

$scope.destiSelected=destiSelectedService.getDesti();

    $scope.ifDesti = function(){

        if($scope.destiSelected==null){
            return false;
        }else{
            console.log($scope.destiSelected.name);
            return true;
        }
    }
    $scope.openAddDestinationModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/createDestination.html',
            controller: 'addDestinationModalInstanceCtrl'

        });

        modalInstance.result.then(function(destino) {
            $scope.destinations.push(destino);
        })
    }
    /**
     * Cierra el modal actual abortando la acción
     */

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }

    $scope.addCardOther = function(submittedCard) {
        $scope.isCreatingCard = true;
        //Nueva Card 
        console.log(submittedCard.destination);
        var date = new Date (submittedCard.eventDate);

        var newCard = {

            cardType: "other",
            name: submittedCard.name,
            description: submittedCard.description,
            link: submittedCard.link,
            price: submittedCard.price,
            destination: submittedCard.destination,
            userIdCreator: $scope.infoUser.id,
            nameCreator: $scope.infoUser.name,
            lastNameCreator: $scope.infoUser.lastName,
            eventDate: date.valueOf()
        }
        console.log(date.valueOf());
        //Llamada PUT a la API para insertar la card de tipo other
        ApiService.putOtherCard($routeParams.groupId, newCard)
            .success(function(data, status) {
                $scope.isCreatingCard = false;
                var newCardReturn = {
                    cardId: data.cardId,
                    creationDate: data.creationDate,
                    cardType: data.cardType,
                    name: data.name,
                    description: data.description,
                    link: data.link,
                    price: data.price,
                    destination: data.destination,
                    userIdCreator: data.userIdCreator,
                    nameCreator: data.nameCreator,
                    lastNameCreator: data.lastNameCreator,
                    eventDate: data.eventDate
                }

                console.log("Card de tipus Other Card creada");
                console.log(newCardReturn);
                $modalInstance.close(newCardReturn);
            })
            .error(function(data, status) {
                $scope.isCreatingCard = false;

                $modalInstance.dismiss();
                console.log("Error al insertar OtherCard!");
            });
    };
});


var DatepickerDemoCtrl = function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
  $scope.format = $scope.formats[0];
};

app.controller("DestinationCtrl", function($rootScope,$scope,$routeParams,  authService, ApiService,groupService, destiSelectedService){

$scope.group={};


//$scope.destinationChoosed="proba";
$scope.selectedCards=[];
$scope.mapSelectedIds={};
$scope.anySelect=false;
$scope.cardsToLink=[];
$scope.linkingToTransport=false;
$scope.linkingToPlace=false;
$scope.onFlow=false;
$scope.cardStartLink={};

$rootScope.resetDesti=function(){
    $scope.destinationChoosed=destiSelectedService.getDesti().name;
    $scope.group= groupService.getGroup();
}

var getGroup=function(){

    return ApiService.getGroup($routeParams.groupId).success(function(response){

        $scope.group=angular.copy(response);
        groupService.setGroup(response);
    });
}

var putPlaceToCard=function(card){

    return ApiService.putPlaceToSleepCard($routeParams.groupId, card).success(function(response){

            getGroup();

            

    }).error(function(data, status) {
            console.log("Error al insertar PlaceToSleep Card!");

        });
}
$scope.group= groupService.getGroup();



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

$scope.canLink = function(card){
    try{
        var arrayIds=[];
        var trobat=false;
        if(angular.equals($scope.cardStartLink.cardType, "transport")&&angular.equals(card.cardType, "transport") ||
            angular.equals($scope.cardStartLink.cardType, "placeToSleep")&&angular.equals(card.cardType, "placeToSleep")) return false;

        if(angular.equals($scope.cardStartLink.cardType, "transport")){
            arrayIds=$scope.cardStartLink.childCardsId;
        }else{

            arrayIds=$scope.cardStartLink.parentCardIds;
        }
        for(var i=0; i<arrayIds.length; i++){

            if(angular.equals(arrayIds[i], card.cardId)) trobat= true;
        }
        if(!trobat){
            return true;
        }else{
            false;
        }

    }catch(error){

        return false;
    }
};

});
