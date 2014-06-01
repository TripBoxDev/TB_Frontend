app.controller("GroupCtrl", function($rootScope, $scope, $routeParams, $location, authService, $modal, $http, ApiService, $log, notificationFactory, groupService, destiSelectedService, $q) {

    if (!authService.data.userInfo.groups.contains($routeParams.groupId)) $location.path('/');
    var endpoint = 'http://tripbox.uab.es/TB_Backend/api/';

    $scope.groupId = $routeParams.groupId;
    $scope.infoUser = authService.data.userInfo;

    if ($routeParams.invitation) {
        ApiService.addUserToGroup($scope.groupId);
    }
    $scope.logoutUser = ApiService.logoutUser;
    $scope.isCollapsed = true;
    $scope.checkPlan = false;
    $scope.destinationMoreVotated = 0;
    $scope.transportMoreVoted = 0;
    $scope.sleepMoreVoted = 0;

    function CollapseDemoCtrl($scope) {
        $scope.isCollapsed = false;
    }
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

    $rootScope.destinationSelected = false;

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
 var rando = function(){
    var j = 0;
        var total = 0;
        var keys=[];
        var numbers=[];
        $scope.others=[];
        $scope.trans=[];
        $scope.place =[];
        
             for (var x in $scope.infoGroup.otherCards) {

                
                j++;
             }
        if ( j <= 4){
            var a=$scope.infoGroup.otherCards;
            $scope.others = a;

        }else{
       while(total < 4) {
        x = Math.floor(Math.random() * (j-1));
            // way faster that looping through the array to check if it exists
        if(keys[x] == undefined) { 
        keys[x] = 1;
        numbers.push(x);
        total++;
        
    }
    }
    
    $scope.others[0]= $scope.infoGroup.otherCards[numbers[0]];
    $scope.others[1]= $scope.infoGroup.otherCards[numbers[1]];
    $scope.others[2]= $scope.infoGroup.otherCards[numbers[2]];
    $scope.others[2]= $scope.infoGroup.otherCards[numbers[3]];
    
}

total =0;
keys=[];
numbers=[];
j=0;
for (var x in $scope.infoGroup.transportCards) {

                j++;
             }
        if ( j<= 4){
            $scope.trans = $scope.infoGroup.transportCards;
        }else{
       while(total < 4) {
        x = Math.floor(Math.random() * (j-1));
            // way faster that looping through the array to check if it exists
        if(keys[x] == undefined) { 
        keys[x] = 1;
        numbers.push(x);
        total++;
    }
    }
    $scope.trans[0]= $scope.infoGroup.transportCards[numbers[0]];
    $scope.trans[1]= $scope.infoGroup.transportCards[numbers[1]];
    $scope.trans[2]= $scope.infoGroup.transportCards[numbers[2]];
    $scope.trans[3]= $scope.infoGroup.transportCards[numbers[3]];
    
    
}
total =0;
keys=[];
numbers=[];
j=0;
for (var x in $scope.infoGroup.placeToSleepCards) {

                j++;
             }
        if ( j<= 4){
            $scope.place = $scope.infoGroup.placeToSleepCards;
        }else{
       while(total < 4) {
        x = Math.floor(Math.random() * (j-1));
            // way faster that looping through the array to check if it exists
        if(keys[x] == undefined) { 
        keys[x] = 1;
        numbers.push(x);
        total++;
        
    }
    }

    $scope.place[0]= $scope.infoGroup.placeToSleepCards[numbers[0]];
    $scope.place[1]= $scope.infoGroup.placeToSleepCards[numbers[1]];
    $scope.place[2]= $scope.infoGroup.placeToSleepCards[numbers[2]];
    $scope.place[3]= $scope.infoGroup.placeToSleepCards[numbers[3]];
    
}
 }
    var getGroup = function() {

        var deferred = $q.defer();

        return ApiService.getGroup($scope.groupId).success(function(response) {
            $scope.infoGroup = angular.copy(response);
            groupService.setGroup(response);
            rando();

        });

        deferred.resolve();
        return deferred.promise;
    };

    getGroup().then(function() {
        getVotesUser();
    });

    $scope.transportVotes = [];

    var getVotesUser = function() {
        $scope.transportVotes = [];

        for (var i = $scope.infoGroup.transportCards.length - 1; i >= 0; i--) {
            for (var j = $scope.infoGroup.transportCards[i].votes.length - 1; j >= 0; j--) {
                if ($scope.infoGroup.transportCards[i].votes[j].userId == $scope.infoUser.id) {
                    $scope.transportVotes[$scope.infoGroup.transportCards[i].cardId] = $scope.infoGroup.transportCards[i].votes[j].value;
                    $scope.infoGroup.transportCards[i].votes[j].value
                }
            }
        }

        $scope.sleepVotes = [];

        for (var i = $scope.infoGroup.placeToSleepCards.length - 1; i >= 0; i--) {
            for (var j = $scope.infoGroup.placeToSleepCards[i].votes.length - 1; j >= 0; j--) {
                if ($scope.infoGroup.placeToSleepCards[i].votes[j].userId == $scope.infoUser.id) {
                    $scope.sleepVotes[$scope.infoGroup.placeToSleepCards[i].cardId] = $scope.infoGroup.placeToSleepCards[i].votes[j].value;
                    $scope.infoGroup.placeToSleepCards[i].votes[j].value
                }
            }
        }

        $scope.otherVotes = [];

        for (var i = $scope.infoGroup.otherCards.length - 1; i >= 0; i--) {
            for (var j = $scope.infoGroup.otherCards[i].votes.length - 1; j >= 0; j--) {
                if ($scope.infoGroup.otherCards[i].votes[j].userId == $scope.infoUser.id) {
                    $scope.otherVotes[$scope.infoGroup.otherCards[i].cardId] = $scope.infoGroup.otherCards[i].votes[j].value;
                    $scope.infoGroup.otherCards[i].votes[j].value
                }
            }
        }

    };

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
                    arrayCard.splice(i, 1, response);
                }
            }

            groupService.setGroup($scope.infoGroup);
        });
    }

    $scope.closeAlert = function() {
        $scope.alertDestinationRepeat = false;
    };

    $scope.hoveringLeave = function(rate) {
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
    $scope.mapDestSelectedIds = {};

    //click destino
    $scope.destiClicked = function(destino) {
        $scope.mapDestSelectedIds = {};

        angular.forEach($scope.infoGroup.destinations, function(desti) {
            if (!angular.equals(destino.id, desti.id)) {
                $scope.mapDestSelectedIds[desti.id] = "opac";
            }
        });

        if (destiSelectedService.getDesti() != null && angular.equals(destino.id, destiSelectedService.getDesti().id)) {
            destiSelectedService.setDesti(null);
            $scope.destinationChoosed1 = destiSelectedService.getDesti();
            $rootScope.destinationSelected = false;
            $scope.mapDestSelectedIds = {};
        } else {
            destiSelectedService.setDesti(destino);
            $scope.destinationChoosed1 = destiSelectedService.getDesti();
            $rootScope.destinationSelected = true;
            $rootScope.resetDesti();

        }


    }


    $scope.isDestRemarc = function(id) {
        var result = $scope.mapDestSelectedIds[id];
        return $scope.mapDestSelectedIds[id];
    };

    //Borrar destino

    




    


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

     $scope.deleteDestination = function(idDest){
        
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/deleteDestiniInfo.html',
            controller: 'deleteDestiInfoInstanceCtrl'
        });

        modalInstance.result.then(function() {
             return ApiService.deleteDestination(idDest).success(function(response) {
            for (var i = $scope.infoGroup.destinations.length - 1; i >= 0; i--) {
                if ($scope.infoGroup.destinations[i].id == idDest) {
                    $scope.infoGroup.destinations.splice(i, 1);
                }
            }
            groupService.setGroup($scope.infoGroup);
        });
        });

    }

     $scope.editCardOther = function(card) {

        $scope.cardother= card;
        var editCardOtherModalInstance = $modal.open({
            templateUrl: 'views/modals/editCardOtherModalContent.html',
            controller: 'editOtherCardModalInstanceCtrl',
            resolve: {
                card: function() {
                    return card;
                },
                destinations: function() {
                    return $scope.infoGroup.destinations;
                },
                infoUser: function() {
                    return $scope.infoUser;
                        }
            }
        });

        

        editCardOtherModalInstance.result.then(function(editCard) {
              if (editCard != null){
                for (var x in $scope.infoGroup.otherCards) {
            
            if ($scope.infoGroup.otherCards[x].cardId === editCard){
                
                $scope.infoGroup.otherCards[x]=  editCard;           
            groupService.setGroup($scope.infoGroup);
            }
}
}  else{
             $scope.infoGroup= getGroup();
            groupService.setGroup($scope.infoGroup);
            
         }

        
        }); 

    };

    $scope.editCardPlace2Sleep = function(card) {

        
        var editCardPlace2SleepModalInstance = $modal.open({
            templateUrl: 'views/modals/editCardPlace2SleepModalContent.html',
            controller: 'editPlace2SleepCardModalInstanceCtrl',
            resolve: {
                card: function() {
                    return card;
                },
                destinations: function() {
                    return $scope.infoGroup.destinations;
                },
                infoUser: function() {
                    return $scope.infoUser;
                        }
            }
        });
        

       editCardPlace2SleepModalInstance.result.then(function(editCard) {
            if (editCard != null){
                for (var x in $scope.infoGroup.placeToSleepCards) {
            
            if ($scope.infoGroup.placeToSleepCards[x].cardId === editCard){
                
                $scope.infoGroup.placeToSleepCards[x]=  editCard;           
            groupService.setGroup($scope.infoGroup);
            }
}
}else{
            $scope.infoGroup= getGroup();
            groupService.setGroup($scope.infoGroup);

            
         }

        
       }); 

    };

$scope.editCardTransport = function(card) {

        
        var editCardTransportModalInstance = $modal.open({
            templateUrl: 'views/modals/editCardTransportModalContent.html',
            controller: 'editTransportCardModalInstanceCtrl',
            resolve: {
                card: function() {
                    return card;
                },
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

        

        editCardTransportModalInstance.result.then(function(editCard) {
            if (editCard != null){
                for (var x in $scope.infoGroup.transportCards) {
            
            if ($scope.infoGroup.transportCards[x].cardId === editCard){
                
                $scope.infoGroup.transportCards[x]=  editCard;            
            groupService.setGroup($scope.infoGroup);
        }
    }

            }else{


            $scope.infoGroup= getGroup();
            groupService.setGroup($scope.infoGroup);
            
         }

        
        }); 

    };
    $scope.AcceptedPlan = function(card) {
        $scope.cartaId = card;
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/AcceptedPlan.html',
            controller: 'AcceptedPlanInstanceCtrl'
        });

    }

    var destinationMoreVotated = function() {
        $scope.transportMoreVoted;
        $scope.sleepMoreVoted;
        $scope.destinationMoreVotated;
        $scope.percentage = 0;
        return ApiService.getGroup($scope.groupId).success(function(response) {

            var array = angular.copy(response);
            var arrayDesti = array.destinations;

            for (var i = arrayDesti.length - 1; i >= 0; i--) {
                var aux = arrayDesti[i].percentage;
                if (aux > 70) {
                    $scope.checkPlan = true;
                    $scope.destinationMoreVotated = arrayDesti[i].name;
                }
            }
            if($scope.checkPlan == true){
                for (var i = array.transportCards.length - 1; i >= 0; i--) {

                    if (array.transportCards[i].destination == $scope.destinationMoreVotated) {

                        if (array.transportCards[i].average >= $scope.percentage) {

                            $scope.percentage = array.transportCards[i].average;
                            $scope.transportMoreVoted = {
                                cardId: array.transportCards[i].cardId,
                                name: array.transportCards[i].name,
                                price: array.transportCards[i].price,
                                initDate: array.transportCards[i].initDate,
                                finalDate: array.transportCards[i].finalDate,
                                description: array.transportCards[i].description,
                                childCardsId: array.transportCards[i].childCardsId
                            }
                        }
                    }
                }

                //Todas las cards de Sleep:
                var arraySleep = $scope.transportMoreVoted.childCardsId;
                var maxVote = 0;
                
                for (var i = $scope.transportMoreVoted.childCardsId.length -1; i >= 0; i--){

                    for (var e = array.placeToSleepCards.length -1; e >= 0; e--){

                        if($scope.transportMoreVoted.childCardsId[i] == array.placeToSleepCards[e].cardId){

                            if (maxVote < array.placeToSleepCards[e].average){
                               
                                $scope.cardsSleep = {"cardId": array.placeToSleepCards[e].cardId, "average": array.placeToSleepCards[e].average};
                                var maxVote = array.placeToSleepCards[e].average;
                                
                            }

                        }


                    }
                   

                }
                for (var i = array.placeToSleepCards.length -1; i >= 0; i--){

                    if(array.placeToSleepCards[i].cardId == $scope.cardsSleep.cardId){
                        
                        $scope.sleepMoreVoted = {
                            cardId: array.placeToSleepCards[i].cardId,
                            name: array.placeToSleepCards[i].name,
                            price: array.placeToSleepCards[i].price,
                            initDate: array.placeToSleepCards[i].initDate,
                            finalDate: array.placeToSleepCards[i].finalDate,
                            description: array.placeToSleepCards[i].description,
                            childCardsId: array.placeToSleepCards[i].parentCardIds
                        }
                        
                    }

                }
            }
        });
    }

    destinationMoreVotated();
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
app.controller('deleteCardInstanceCtrl', function($scope, $modalInstance, authService, $http, $routeParams, ApiService, groupService) {

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }
    

    $scope.confirmDeleteCard = function() {
        $modalInstance.close();

    }
});

app.controller('deleteDestiInfoInstanceCtrl', function($scope, $modalInstance, authService, $http, $routeParams, ApiService, groupService) {

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }
    

    $scope.confirmDeleteCard = function() {
        $modalInstance.close();

    }
});
app.controller('editTransportCardModalInstanceCtrl', function($scope, $modalInstance, $modal, $routeParams, ApiService, authService, transports, destinations, infoUser,destiSelectedService,card) {
    $scope.isCreatingCard = false;
    $scope.destinations = destinations.filter(function(v) {
        return v !== ''
    });
    $scope.infoUser = infoUser;
    $scope.newCard = card;
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
    $scope.deleteCard = function(){
       
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/deleteCard.html',
            controller: 'deleteCardInstanceCtrl'
        });

        modalInstance.result.then(function() {
             ApiService.deleteCard($routeParams.groupId, card.cardId).success(function(data, status) {
            $modalInstance.close();
        }); 
        });

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
            cardId: card.cardId,
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
                $modalInstance.close(newCardReturn);

            })

        .error(function(data, status) {
            console.log("Error al insertar Transport Card!");
            $modalInstance.dismiss();

        });

    };
});

app.controller('editPlace2SleepCardModalInstanceCtrl', function($scope, $modalInstance, $modal, $routeParams, ApiService, destinations, groupService, infoUser,destiSelectedService,card) {
   $scope.isCreatingCard = false;
   $scope.Group = {};
    $scope.destinations = destinations;
    $scope.infoUser = infoUser;
    $scope.newCard=card;
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

   
    $scope.deleteCard = function(){
       
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/deleteCard.html',
            controller: 'deleteCardInstanceCtrl'
        });

        modalInstance.result.then(function() {
             ApiService.deleteCard($routeParams.groupId, card.cardId).success(function(data, status) {
            $modalInstance.close();
        }); 
        });

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
            cardId: card.cardId,
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
app.controller('editOtherCardModalInstanceCtrl', function($scope, $modalInstance, $modal, $routeParams, ApiService, destinations, infoUser,destiSelectedService,card) {
    $scope.isCreatingCard = false;
    $scope.destinations = destinations;
    $scope.infoUser = infoUser;
    $scope.newCard=card;
    
 
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
     $scope.deleteCard = function(){
       
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/deleteCard.html',
            controller: 'deleteCardInstanceCtrl'
        });

        modalInstance.result.then(function() {
             ApiService.deleteCard($routeParams.groupId, card.cardId).success(function(data, status) {
            $modalInstance.close();
        }); 
        });

    }
    $scope.cancel = function() {
        $modalInstance.dismiss();
    }

    $scope.addCardOther = function(submittedCard) {
        $scope.isCreatingCard = true;
        //Nueva Card 
        console.log(submittedCard.destination);
        var date = new Date (submittedCard.eventDate);

        var editCard = {
            cardId: $scope.newCard.cardId,
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
        
        //Llamada PUT a la API para insertar la card de tipo other
        ApiService.putOtherCard($routeParams.groupId, editCard)
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

            if (destinations[x].name === destination) {

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
app.controller('CreateTransportCardModalInstanceCtrl', function($rootScope, $scope, $modalInstance, $modal, $routeParams, ApiService, authService, transports, destinations, infoUser, destiSelectedService) {

    $scope.isCreatingCard = false;
    $scope.destinations = destinations.filter(function(v) {
        return v !== ''
    });
    $scope.infoUser = infoUser;
    $scope.transportTypes = ['Autobús', 'Avión', 'Barco', 'Coche', 'Tren', 'Otro'];
    $scope.transportType = $scope.transportTypes[0];
    $scope.destiSelected = destiSelectedService.getDesti();

    $scope.ifDesti = function() {

        if ($scope.destiSelected == null) {
            return false;
        } else {
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

        var init = new Date(submittedCard.initDate);
        var fina = new Date(submittedCard.finalDate);
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

app.controller('CreatePlace2SleepCardModalInstanceCtrl', function($rootScope, $scope, $modalInstance, $modal, $routeParams, ApiService, placeToSleepCards, destinations, infoUser, destiSelectedService) {

    $scope.isCreatingCard = false;
    $scope.destinations = destinations;
    $scope.infoUser = infoUser;
    $scope.placeTypes = ['Apartamento', 'Cámping', 'Couchsurfing', 'Hotel', 'Modo Aventura', 'Refugio', 'Otro'];
    $scope.placeType = $scope.placeTypes[0];
    $scope.destiSelected = destiSelectedService.getDesti();

    $scope.ifDesti = function() {

        if ($scope.destiSelected == null) {
            return false;
        } else {
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
        var init = new Date(submittedCard.initDate);
        var fina = new Date(submittedCard.finalDate);
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
app.controller('CreateOtherCardModalInstanceCtrl', function($rootScope, $scope, $modalInstance, $modal, $routeParams, ApiService, destinations, infoUser, destiSelectedService) {

    $scope.isCreatingCard = false;
    $scope.destinations = destinations;
    $scope.infoUser = infoUser;

    $scope.destiSelected = destiSelectedService.getDesti();

    $scope.ifDesti = function() {

        if ($scope.destiSelected == null) {
            return false;
        } else {
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

        var date = new Date(submittedCard.eventDate);

        if ($rootScope.destinationSelected) {
            submittedCard.destination = $scope.destiSelected.name;
        }

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

app.controller('AcceptedPlanInstanceCtrl', function($scope, $modalInstance, authService, $http, $routeParams, ApiService, groupService) {

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }


    $scope.confirmAcceptedPlan = function() {
        $modalInstance.close();

    }
});


var DatepickerDemoCtrl = function($scope) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function() {
        $scope.showWeeks = !$scope.showWeeks;
    };

    $scope.clear = function() {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function() {
        $scope.minDate = ($scope.minDate) ? null : new Date();
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


/**
 * Controla la vista cuando clickas dentro de un destino
 */
app.controller("DestinationCtrl", function($rootScope, $scope, $routeParams, authService, ApiService, groupService, destiSelectedService, notificationFactory) {

    $scope.group = {};



    $scope.selectedCards = [];

    /**
     * Lista de cardId's que se volveran transparentes
     */
    $scope.disabledCards = [];
    $scope.anySelect = false;

    $scope.linkingToTransport = false;
    $scope.linkingToPlace = false;
    $scope.onFlow = false;
    $scope.cardStartLink = {};


    $scope.hoveredCard = {};

    $rootScope.resetDesti = function() {
        $scope.destinationChoosed = destiSelectedService.getDesti().name;
        $scope.group = groupService.getGroup();
    }

    var getGroup = function() {

        return ApiService.getGroup($routeParams.groupId).success(function(response) {

            $scope.group = angular.copy(response);
            groupService.setGroup(response);
        });
    }

    var putPlaceToSleepCard = function(card) {

        return ApiService.putPlaceToSleepCard($routeParams.groupId, card).success(function(response) {
            getGroup();
            notificationFactory.success('Card enlazada con éxito.')

        }).error(function(data, status) {
            notificationFactory.error('Hubo un problema al enlazar la card.');
        });
    }
    $scope.group = groupService.getGroup();



    $scope.isRemarc = function(id) {
        return $scope.disabledCards[id];
    };

    $scope.cardTransportSelected = function(cardSelected) {

        $scope.disabledCards = [];

        if (!$scope.anySelect) {
            angular.forEach($scope.group.transportCards, function(card) {
                if (!angular.equals(card.cardId, cardSelected.cardId)) {
                    $scope.disabledCards.push(card.cardId);
                }
            });

            angular.forEach($scope.group.placeToSleepCards, function(card) {
                var find = false;
                var count = 0

                while (count < cardSelected.childCardsId.length && !find) {
                    if (angular.equals(cardSelected.childCardsId[count], card.cardId)) {
                        find = true;
                    }
                    count += 1;
                }
                if (!find) {
                    $scope.disabledCards.push(card.cardId);
                }
            });
            $scope.anySelect = true;

        } else {
            $scope.anySelect = false;
        }

    };

    /**
     * Guarda la card que esta siendo hovered
     */
    $scope.setHoveredCard = function(card) {
        $scope.hoveredCard = card;
    }

    /**
     * Al salir del hover en una card elimina la card guardada
     */
    $scope.removeHoveredCard = function() {
        $scope.hoveredCard = {};
    }

    $scope.cardPlaceToSelected = function(cardSelected) {
        $scope.disabledCards = [];

        if (!$scope.anySelect) {
            angular.forEach($scope.group.placeToSleepCards, function(card) {
                if (!angular.equals(card.cardId, cardSelected.cardId)) {
                    $scope.disabledCards[card.cardId] = "opac";
                }
            });
            angular.forEach($scope.group.transportCards, function(card) {
                var find = false;
                var count = 0
                while (count < cardSelected.parentCardIds.length && !find) {
                    if (angular.equals(cardSelected.parentCardIds[count], card.cardId)) {
                        find = true;
                    }
                    count += 1;
                }
                if (!find) {
                    $scope.disabledCards[card.cardId] = "opac";
                }
            });
            $scope.anySelect = true;
        } else {
            $scope.anySelect = false;
        }


    };



    /**
     * Metodo que realiza 3 funciones:
     * - Si no estamos linkando ninguna card: activa el modo linkar.
     * - Si ya estamos linkando una card: enlaza con la card seleccionada
     * - Si la card seleccionada es la misma que esta siendo linkada: cancela link
     */
    $scope.triggerLink = function(card) {

        // Comprueba si hay una card de antes
        if (!$scope.areWeLinking()) {
            startLink(card);
        } else {
            if ($scope.cardStartLink.cardId === card.cardId) {
                //  Hemos clickado en la misma card --> cancela link
                resetStat();
            } else {
                endLink(card);

            }

        }
    }

    /**
     * Retorna si estamos linkando actualmente o no,
     */
    $scope.areWeLinking = function() {
        return $scope.cardStartLink.hasOwnProperty('cardId');
    }

    /**
     * Cancela el link actual
     */
    $scope.cancelLink = function() {
        resetStat();
    };

    /**
     * Marca la card actual como card para linkar y
     * deshabilita el resto de su mismo tipo.
     */
    var startLink = function(card) {
        $scope.cardStartLink = card;

        $scope.disabledCards = [];

        // Inhabilita el resto de cards transport
        if (card.cardType === "transport") {
            angular.forEach($scope.group.transportCards, function(transCard) {
                if (!angular.equals(transCard.cardId, card.cardId)) {
                    $scope.disabledCards.push(transCard.cardId);
                }
            });
            $scope.linkingToPlace = true;

            // Inhabilita el resto de cards placeToSleep
        } else if (card.cardType === "placeToSleep") {
            angular.forEach($scope.group.placeToSleepCards, function(placeCard) {
                if (!angular.equals(placeCard.cardId, card.cardId)) {
                    $scope.disabledCards.push(placeCard.cardId);
                }
            });
            $scope.linkingToTransport = true;
        }
    }

    /**
     * Finaliza un link con éxito.
     */
    var endLink = function(card) {
        var placeToSleepCard = {}
        if (angular.equals(card.cardType, "transport")) {
            placeToSleepCard = angular.copy($scope.cardStartLink);
            placeToSleepCard.parentCardIds.push(card.cardId);
        } else {
            placeToSleepCard = angular.copy(card);
            placeToSleepCard.parentCardIds.push($scope.cardStartLink.cardId);
        }
        putPlaceToSleepCard(placeToSleepCard);

        resetStat();
    }
    /**
     * Reinicializa todas las variables al acabar o cancelar un link
     */
    var resetStat = function() {
        $scope.disabledCards = [];
        $scope.linkingToTransport = false;
        $scope.linkingToPlace = false;
        $scope.anySelect = false;
        $scope.cardStartLink = {};
    }

    $scope.cardLinkingStatus = function(card) {
        try {

            if ($scope.cardStartLink.cardId === card.cardId) {
                return 'linking';
            } else {
                return 'not-linking';
            }
        } catch (error) {
            return 'not-linking';
        }

    };


    /** 
     * Comprueba si la card que recibes por argumento esta enlazada con la que esta siendo hovered
     * Si la card es la misma que la hovered retorna true también.
     */
    $scope.isThisCardLinked = function(card) {
        if ($scope.hoveredCard.hasOwnProperty('cardId')) {
            if ($scope.hoveredCard.cardId === card.cardId) {
                return true;
            } else if (typeof $scope.hoveredCard.childCardsId !== 'undefined' && $scope.hoveredCard.childCardsId.contains(card.cardId)) {
                return true;
            } else if (typeof $scope.hoveredCard.parentCardIds !== 'undefined' && $scope.hoveredCard.parentCardIds.contains(card.cardId)) {
                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }
    }

    /**
     * Comprueba si la card que recibe por parametro es
     * la misma que esta siendo linkada.
     */
    $scope.isCardStartLink = function(card) {
        try {

            if ($scope.cardStartLink.cardId === card.cardId) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }

    };

    /**
     * Retorna si la card está deshabilitada o no
     */
    $scope.isCardDisabled = function(cardId) {
        return $scope.disabledCards.contains(cardId);
    }
    $scope.canLink = function(card) {
        try {
            var arrayIds = [];
            var trobat = false;
            if (angular.equals($scope.cardStartLink.cardType, "transport") && angular.equals(card.cardType, "transport") ||
                angular.equals($scope.cardStartLink.cardType, "placeToSleep") && angular.equals(card.cardType, "placeToSleep")) return false;

            if (angular.equals($scope.cardStartLink.cardType, "transport")) {
                arrayIds = $scope.cardStartLink.childCardsId;
            } else {

                arrayIds = $scope.cardStartLink.parentCardIds;
            }
            for (var i = 0; i < arrayIds.length; i++) {

                if (angular.equals(arrayIds[i], card.cardId)) trobat = true;
            }
            if (!trobat) {
                return true;
            } else {
                false;
            }

        } catch (error) {

            return false;
        }
    };

});