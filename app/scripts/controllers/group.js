app.controller("GroupCtrl", function($scope, $routeParams, authService, $modal, $http) {

    var endpoint = 'http://tripbox.uab.es/TB_Backend/api/';

    $scope.groupId = $routeParams.groupId;
    $scope.infoUser = authService.data.userInfo;

    $scope.openInviteModal = function() {

        var invitationModalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'InvitationModalInstanceCtrl'
        });

    };

    <!--Leer información del grupo-->

    $scope.infoGroup = [];

    $http.get(endpoint + 'group/' + $scope.groupId)
        .success(function(data, status) {
            $scope.infoGroup = data;
            console.log("información del grupo recibida");
        }).
    error(function(data, status) {
        console.log("error al recibir información del grupo");
    });


    <!--Añadir nuevo destino-->

    $scope.addDestination = function(destino) {

        $http.put(endpoint + 'group/' + $scope.groupId + '/destination', destino, {
            headers: {
                'Content-Type': 'text/plain'
            }
        })
            .success(function(data, status) {
                console.log("destino insertado");
                $scope.infoGroup.destinations.push(destino);

            }).
        error(function(data, status) {
            console.log("error al insertar destino");
        });

    }

    /*
    <!--Añadir place to sleep de forma manual-->

    var newPlaceToSleep = {
        cardType: "placeToSleep",
        destination: "Barcelona",
        userIdCreator: $scope.infoUser.id
    }

    $http.put(endpoint + 'group/' + $scope.groupId + '/placeToSleepCard', newPlaceToSleep)
        .success(function(data, status) {
            console.log("place to sleep insertado");
            $scope.infoGroup.placeToSleepCards.push(newPlaceToSleep);

        }).
    error(function(data, status) {
        console.log("error al insertar place to sleep");
    });
    */



    <!--Añadir nueva Card Other-->

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


        //Llamada PUT a la API para insertar el nuevo grupo
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


                console.log("Card de tipus Other Card creada" );
                $scope.infoGroup.otherCards.push(newCardReturn);


            })

        .error(function(data, status) {
            console.log("Error al insertar OtherCard!");
        });

    };

    $scope.types = ['Autobús', 'Avión', 'Coche', 'Tren','Barco','Otro'];
  $scope.type = $scope.types[0];
  $scope.placeTypes = ['Hotel', 'Couchsurfing', 'Apartamento', 'Camping','Modo Aventura','Refugio','Otro'];
  $scope.placeType = $scope.types[0];

  // Añadir nueva Card Transporte

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
            transportType: submittedCard.type


        }


        //Llamada PUT a la API para insertar la nueva Card
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


                console.log("Card de tipus Transport Card creada" );
                $scope.infoGroup.transportCards.push(newCardReturn);


            })

        .error(function(data, status) {
            console.log("Error al insertar Transport Card!");
        });

    };

    $scope.addCardPlaceToSleep = function(submittedCard) {

        


        //Nueva Card 

        var newCard = {
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


        //Llamada PUT a la API para insertar el nuevo grupo
        $http.put(endpoint + 'group/' + $scope.groupId + '/placeToSleepCard', newCard)
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
                    placeType: data.placeType


                }


                console.log("Card de tipus placeToSleep Card creada" );
                $scope.infoGroup.placeToSleepCards.push(newCardReturn);


            })

        .error(function(data, status) {
            console.log("Error al insertar placeToSleepCard!");
        });

    };


});

<!-- Controlador calendario -->
var DatepickerDemoCtrl = function($scope) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    

    

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
};

app.controller('InvitationModalInstanceCtrl', function($scope, $modalInstance, ApiService) {
    $scope.users = [];
    $scope.addInvite = function() {
        $scope.users.push($scope.newUser);

        $scope.newUser = '';
    }

    $scope.sendInvitations = function() {
        console.log($scope.users);
        ApiService.sendInvitations($scope.users, 21);
        $modalInstance.close();

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
});