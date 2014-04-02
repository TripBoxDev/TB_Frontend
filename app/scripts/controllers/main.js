'use strict';

angular.module('angulApp')
    .controller('MainCtrl', function($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    })


//PETICION JSON HACIA LA API

//para hacer uso de $resource debemos colocarlo al crear el modulo

//con dataResource inyectamos la factoría
.controller("GroupsCtrl", function($scope) {

    //hacemos uso de $http para obtener los datos del json
    $http.get('data.json').success(function(data) {
        //Convert data to array.
        //datos lo tenemos disponible en la vista gracias a $scope
        $scope.datos = data;
    });
    //datosResource lo tenemos disponible en la vista gracias a $scope
    $scope.datosResource = dataResource.get();
});

