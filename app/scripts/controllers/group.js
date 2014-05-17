app.controller("GroupCtrl", function($scope, $routeParams, authService, $modal, $http) {

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

    // <!--Leer información del grupo-->

    $scope.infoGroup = {};

    $http.get(endpoint + 'group/' + $scope.groupId)
        .success(function(data, status) {
            $scope.infoGroup = data;
            console.log("información del grupo recibida");
            console.log($scope.infoGroup);


        }).
    error(function(data, status) {
        console.log("error al recibir información del grupo");
    });


    // <!--Voting-->

    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
    };

    $scope.hoveringLeave = function(cardId, rate) {

        console.log("rate: ", rate);
        console.log("cardId: ", cardId);

        var newVote = {
            "userId": $scope.infoUser.id,
            "value": rate
        }

        $http.put(endpoint + 'group/' + $scope.groupId + '/card/' + cardId + '/vote', newVote)
            .success(function(data, status) {
                console.log("votación realizada");
                //Devuelve la card con la puntuación (habría que mostrar la card con las estrellas sombreadas)
            }).
        error(function(data, status) {
            console.log("error al insertar votación");
        });
    };




    $scope.closeAlert = function() {
        $scope.alertDestinationRepeat = false;
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


    /*
    //<!-- Borrar destino -->

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
    $scope.posibleMatching = [];




    /**
     * Abre el modal para añadir un nuevo destino
     */
    $scope.openAddDestinationModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/crearDestino.html',
            controller: 'addDestinationModalInstanceCtrl'

        });
    }


    $scope.nombre = function() {
        $scope.posibleMatching = [];

        var destination = $scope.infoGroup.destinations[document.getElementById('newCard.destination').value];
        for (var i = $scope.infoGroup.transportCards.length - 1; i >= 0; i--) {
            if ($scope.infoGroup.transportCards[i].destination == destination) {

                $scope.posibleMatching.push($scope.infoGroup.transportCards[i]);

            }
        }

    };


    // <!--Añadir nueva Card Other-->

    $scope.addCardOther = function(submittedCard) {

        //Nueva Card 
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
            eventDate: submittedCard.dt.getTime()
        }

        //Llamada PUT a la API para insertar la card de tipo other
        $http.put(endpoint + 'group/' + $scope.groupId + '/otherCard', newCard)
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
                    eventDate: data.eventDate
                }

                console.log("Card de tipus Other Card creada");
                $scope.infoGroup.otherCards.push(newCardReturn);
            })
            .error(function(data, status) {
                console.log("Error al insertar OtherCard!");
            });
    };

    //Tipos de transporte 
    $scope.transportTypes = ['Autobús', 'Avión', 'Barco', 'Coche', 'Tren', 'Otro'];
    $scope.transportType = $scope.transportTypes[0];

    // <!--Añadir nueva Card Transporte-->

    $scope.addCardTransport = function(submittedCard) {

        //Nueva Card 
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
            initDate: submittedCard.dtInit.getTime(),
            finalDate: submittedCard.dtFinal.getTime(),
            transportType: submittedCard.transportType
        }

        //Llamada PUT a la API para insertar la card de tipo transporte
        $http.put(endpoint + 'group/' + $scope.groupId + '/transportCard', newCard)
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
                $scope.infoGroup.transportCards.push(newCardReturn);
            })

        .error(function(data, status) {
            console.log("Error al insertar Transport Card!");
        });

    };





    //Tipos de alojamiento
    $scope.placeTypes = ['Apartamento', 'Cámping', 'Couchsurfing', 'Hotel', 'Modo Aventura', 'Refugio', 'Otro'];
    $scope.placeType = $scope.placeTypes[0];

    // <!--Añadir nueva Card Alojamiento-->

    $scope.addCardPlaceToSleep = function(submittedCard) {
        console.log(submittedCard.parentCardId);
        //Nueva Card 
        var newCard = {
            parentCardIds: [submittedCard.parentCardId],
            cardType: "placeToSleep",
            name: submittedCard.name,
            description: submittedCard.description,
            link: submittedCard.link,
            price: submittedCard.price,
            destination: submittedCard.destination,
            userIdCreator: $scope.infoUser.id,
            nameCreator: $scope.infoUser.name,
            lastNameCreator: $scope.infoUser.lastName,
            initDate: submittedCard.dtInit.getTime(),
            finalDate: submittedCard.dtFinal.getTime(),
            placeType: submittedCard.type
        }

        //Llamada PUT a la API para insertar la card de tipo alojamiento
        $http.put(endpoint + 'group/' + $scope.groupId + '/placeToSleepCard', newCard)
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
                $scope.infoGroup.placeToSleepCards.push(newCardReturn);
            })
            .error(function(data, status) {
                console.log("Error al insertar placeToSleepCard!");
            });
    };

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

app.controller('addDestinationModalInstanceCtrl', function($scope, $modalInstance, authService, $http, $routeParams) {
    // <!--Añadir nuevo destino-->

    var destinations = authService.data.userInfo.destinations,
        endpoint = 'http://tripbox.uab.es/TB_Backend/api/',
        groupId = $routeParams.groupId;

    $scope.isLoading = false;

    $scope.destino = '';
    $scope.addDestination = function(destino) {
        console.log('inside addDestination');
        $scope.alertDestinationRepeat = false;


        if (!$scope.destinationExists(destino)) {

            $http.put(endpoint + 'group/' + groupId + '/destination', destino, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
                .success(function(data, status) {
                    console.log("destino insertado");
                    // TODO Añadir destino a la lista de arrays, cuando authService user info esté arreglad
                    //destinations.push(destino);
                    $modalInstance.close();
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
return false;
        //return (destinations.indexOf(destination) == -1) ;
    }
});