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
.controller("GroupsCtrl", function($scope, $http) {

    //Esta es la id del usuario que nos dará la sesión
    var user = "123456"
    //Esta es la lista de grupos
    $scope.groups = [];

    //Intentamos leer los datos del usuario
    $http.get('http://tripbox.uab.cat/TB_Backend/api/user/'+user)
        .success(function(result){
            
            //Si ha funcionado, recorre cada grupo de viaje al que pertenece el usuario
            for (var i = result["groups"].length - 1; i >= 0; i--) {
                //Lee los datos del grupo
                $http.get('http://tripbox.uab.cat/TB_Backend/api/group/'+ result["groups"][i])
                .success(function(result){

                    //Y si ha salido todo bien, añade a la lista del grupo los datos del grupo recién leido
                    $scope.groups.push({id:result["id"], name:result["name"], description:result["description"]})

                });
            };
        });

    /*$('html').append(result["groups"][0]);
    Esta es una utilidad que sirve para añadir al html. Va bien para debug*/

   /* 
    var url = '445566'
    $http.get('http://tripbox.uab.cat/TB_Backend/api/group/'+ url)
        .success(function(result){
            $scope.groups.push({id:result["id"], name:result["name"], description:result["description"]})
        }); */

    /*$scope.groups = [
        {id:1, name:'Miami', description:'País muy bonito pq lo digo yo'},
        {id:2, name:'Berlin', description:'Me encanta la cerveza negra'},
        {id:3, name:'Luxenburgo', description:'Aquí se te ha ido de las manos Correa xd'},
        {id:4, name:'Dublin', description:'Aquí se te ha ido de las manos Correa xd'},
        {id:5, name:'Amsterdam', description:'Aquí se te ha ido de las manos Correa xd'},
        {id:6, name:'Japon', description:'Aquí se te ha ido de las manos Correa xd'},
        {id:7, name:'Hawai', description:'Aquí se te ha ido de las manos Correa xd'}
    ];*/

    $scope.addGroup = function() {
        $scope.groups.push({id:7, name:'Hawai', description:'Aquí se te ha ido de las manos Correa xd'});
        console.log($scope.groups);
    }

    $scope.unfollowGroup = function(id){
        
        for (var i = $scope.groups.length - 1; i >= 0; i--){
            if ($scope.groups[i].id == id){
                $scope.groups.splice(i,1);
            }

        }
    }
    /*
    //hacemos uso de $http para obtener los datos del json
    $http.get('data.json').success(function(data) {
        //Convert data to array.
        //datos lo tenemos disponible en la vista gracias a $scope
        $scope.datos = data;
    });
    //datosResource lo tenemos disponible en la vista gracias a $scope
    $scope.datosResource = dataResource.get();
    */
})
  .controller('LoginCtrl', function ($scope, $routeParams) {
    $scope.socialNetwork = $routeParams.socialNetwork;
  });
