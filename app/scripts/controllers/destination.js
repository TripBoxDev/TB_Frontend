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

    

    var getGroup = function() {

        return ApiService.getGroup($routeParams.groupId).success(function(response) {

            $scope.group = angular.copy(response);
            groupService.setGroup(response);
            calculateMaxPagesOfRows();
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
    var maxCardsOnRow=3;
    $scope.maxtransportCardsPages=0;
    $scope.maxplaceToSleepCardsPages=0;
    $scope.maxotherCardsPages=0;
    $scope.transportCardsPage=0;
    $scope.placeToSleepCardsPage=0;
    $scope.otherCardsPage=0;
    $scope.itemOnView=function(index, cardType){

        var initIndexOfPage;
        if(cardType=="transport"){
            initIndexOfPage=$scope.transportCardsPage*maxCardsOnRow;

        }else if(cardType=="placeToSleep"){
            initIndexOfPage=$scope.placeToSleepCardsPage*maxCardsOnRow;
        }else if(cardType=="other"){
            initIndexOfPage=$scope.otherCardsPage*maxCardsOnRow;
        }

        
        if (initIndexOfPage<=index && initIndexOfPage+maxCardsOnRow>index) return true;
    }

    $scope.nextPage=function(cardsType){
        if(cardsType=="transport"){
            $scope.transportCardsPage+=1;

        }else if(cardsType=="placeToSleep"){
           $scope.placeToSleepCardsPage+=1;
        }else if(cardsType=="other"){
            $scope.otherCardsPage+=1;
        }
    }
    $scope.previousPage=function(cardsType){
        if(cardsType=="transport"){
            if($scope.transportCardsPage!=0)
            $scope.transportCardsPage-=1;

        }else if(cardsType=="placeToSleep"){
            if($scope.placeToSleepCardsPage!=0)
           $scope.placeToSleepCardsPage-=1;
        }else if(cardsType=="other"){
            if($scope.otherCardsPage!=0)
            $scope.otherCardsPage-=1;
        }
    }

    var calculateMaxPagesOfRows = function(){
        var count = 0;
  
        angular.forEach($scope.group.transportCards, function(card){
        if(card.destination==destiSelectedService.getDesti().name) count++;
        });
        
        $scope.maxtransportCardsPages=Math.ceil(count/maxCardsOnRow)-1;
        if(count==0) $scope.maxtransportCardsPages=0;
       
        count = 0;
        angular.forEach($scope.group.placeToSleepCards, function(card){
        if(card.destination==destiSelectedService.getDesti().name) count++;
        });
        
        $scope.maxplaceToSleepCardsPages=Math.ceil(count/maxCardsOnRow)-1;
        if(count==0) $scope.maxplaceToSleepCardsPages=0;
        
        console.log(count);
        
        count = 0;
        angular.forEach($scope.group.otherCards, function(card){
        if(card.destination==destiSelectedService.getDesti().name){
                count++;
        } 
        });
    
       $scope.maxotherCardsPages=Math.ceil(count/maxCardsOnRow)-1;
       if(count==0) $scope.maxotherCardsPages=0;
 
        
    }
    
calculateMaxPagesOfRows();

});