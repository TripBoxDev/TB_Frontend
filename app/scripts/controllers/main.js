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
    var id = "445566";
    /*scope.groups = [];*/
    var url = 'http://tripbox.uab.cat/TB_Backend/api/group/';
    var url = $url.concat($id);
    $('html').append(url);
    /*$http.get('http://tripbox.uab.cat/TB_Backend/api/group/'+$id)
        .success(function(result){
            $scope.groups
            $('html').append(result["name"]);
        });*/

    

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
