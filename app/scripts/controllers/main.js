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
.controller("GroupsCtrl", function($scope, $http) {

    //Esta es la id del usuario que nos dará la sesión
    var user = "123456"
    //Esta es la lista de grupos
    $scope.groups = [];

    //Intentamos leer los datos del usuario
    $http.get('http://tripbox.uab.cat/TB_Backend/api/user/' + user)
        .success(function(result){
            
            //Si ha funcionado, recorre cada grupo de viaje al que pertenece el usuario
            for (var i = result["groups"].length - 1; i >= 0; i--) {
                //Lee los datos del grupo
                $http.get('http://tripbox.uab.cat/TB_Backend/api/group/'+ result["groups"][i])
                .success(function(result){

                    //Y si ha salido todo bien, añade a la lista del grupo los datos del grupo recién leido
                    $scope.groups.push({id:result["id"], name:result["name"]})

                });
            };
        });

    $scope.addGroup = function() {
        
        $scope.groups.push({id:7, name:'Hawai', description:'Aquí se te ha ido de las manos Correa xd'});
        console.log($scope.groups);
        
        //Fututa funcion hacia la API
        /*
        $http.put('http://tripbox.uab.cat/TB_Backend/api/group', {name:'New Group', description:'Prueba de Frontend0', users:123456})
        */

    }

    $scope.unfollowGroup = function(id){
        
        var user = "123456789"
        var group = "987654321"

        for (var i = $scope.groups.length - 1; i >= 0; i--){
            if ($scope.groups[i].id == id){
                $scope.groups.splice(i,1);
                //Fututa funcion hacia la API
                /*
                $http.delete('http://tripbox.uab.cat/TB_Backend/api/group/' + grpup + '/user/' + user)

                */
            }

        }
    }

    //Lista de grupos para utilizar como ejemplo:
    /*$scope.groups = [
        {id:1, name:'Miami', description:'País muy bonito pq lo digo yo'},
        {id:2, name:'Berlin', description:'Me encanta la cerveza negra'},
        {id:3, name:'Luxenburgo', description:'Aquí se te ha ido de las manos Correa xd'},
        {id:4, name:'Dublin', description:'Aquí se te ha ido de las manos Correa xd'},
        {id:5, name:'Amsterdam', description:'Aquí se te ha ido de las manos Correa xd'},
        {id:6, name:'Japon', description:'Aquí se te ha ido de las manos Correa xd'},
        {id:7, name:'Hawai', description:'Aquí se te ha ido de las manos Correa xd'}
    ];*/

})
  .controller('LoginCtrl', function ($scope, $routeParams) {
    $scope.socialNetwork = $routeParams.socialNetwork;
  });
