app.controller("GroupCtrl", function($scope, $routeParams, authService, $modal, $http, ApiService, $log, notificationFactory, groupService) {

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
            $scope.openCreateTypeCardModal(typeSelected);
        });

    };

    //Recibe que tipo de card se quiere crear y muestra el modal asociado

    $scope.openCreateTypeCardModal = function(typeSelected) {
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

    /* 
   $http.get(endpoint + 'group/' + $scope.groupId)
        .success(function(data, status) {
            $scope.infoGroup = data;
            console.log("información del grupo recibida");
            console.log($scope.infoGroup);


        }).
    error(function(data, status) {
        console.log("error al recibir información del grupo");
    });
    */

    //Voting

    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
    };

    var putVote = function(cardId, rate) {

        var newVote = {
            "userId": $scope.infoUser.id,
            "value": rate
        }

        return ApiService.putVote(cardId, newVote).success(function(response) {
            console.log(response);
        });
    }

    /* 
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
    */



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



    //Borrar destino

    var deleteDestination = function(destino) {
        return ApiService.deleteDestination(destino).success(function(response) {
            for (var i = $scope.infoGroup.destinations.length - 1; i >= 0; i--) {
                if ($scope.infoGroup.destinations[i] == destino) {
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

app.controller('addDestinationModalInstanceCtrl', function($scope, $modalInstance, authService, $http, $routeParams) {

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }
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
                    $modalInstance.close(destino);
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
app.controller('CreateTransportCardModalInstanceCtrl', function($scope, $modalInstance, $modal, $routeParams, ApiService, authService, transports, destinations, infoUser) {
    $scope.isCreatingCard = false;
    $scope.destinations = destinations.filter(function(v) {
        return v !== ''
    });
    $scope.infoUser = infoUser;
    $scope.transportTypes = ['Autobús', 'Avión', 'Barco', 'Coche', 'Tren', 'Otro'];
    $scope.transportType = $scope.transportTypes[0];

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
app.controller('CreatePlace2SleepCardModalInstanceCtrl', function($scope, $modalInstance, $modal, $routeParams, ApiService, placeToSleepCards, destinations, infoUser) {
    $scope.isCreatingCard = false;
    $scope.destinations = destinations;
    $scope.infoUser = infoUser;
    $scope.placeTypes = ['Apartamento', 'Cámping', 'Couchsurfing', 'Hotel', 'Modo Aventura', 'Refugio', 'Otro'];
    $scope.placeType = $scope.placeTypes[0];

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
app.controller('CreateOtherCardModalInstanceCtrl', function($scope, $modalInstance, $modal, $routeParams, ApiService, destinations, infoUser) {
    $scope.isCreatingCard = false;
    $scope.destinations = destinations;
    $scope.infoUser = infoUser;


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
        var newCard = {

            cardType: "other",
            name: submittedCard.name,
            description: submittedCard.description,
            link: submittedCard.link,
            price: submittedCard.price,
            destination: submittedCard.destination,
            userIdCreator: $scope.infoUser.id,
            nameCreator: $scope.infoUser.name,
            lastNameCreator: $scope.infoUser.lastName
        }

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

                $modalInstance.close(newCardReturn);
            })
            .error(function(data, status) {
                $scope.isCreatingCard = false;

                $modalInstance.dismiss();
                console.log("Error al insertar OtherCard!");
            });
    };
});