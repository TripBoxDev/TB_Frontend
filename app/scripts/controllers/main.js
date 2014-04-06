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
                    $scope.groups.push({id:result["id"], name:result["name"], description:result["description"]})

                });
            };
        });

    $scope.addGroup = function(groupName, groupDescription) {

        $scope.groups.push({id:'12345', name:groupName, description:groupDescription});
        console.log($scope.groups);
        
        //Fututa funcion hacia la API
        /*
        $http.put('http://tripbox.uab.cat/TB_Backend/api/group', {name:'New Group', description:'Prueba de Frontend0', users:123456})
        */

    }

    $scope.editGroup = function(id, groupName, groupDescription) {
        for (var i = $scope.groups.length - 1; i >= 0; i--){
            if ($scope.groups[i].id == id){
                $scope.groups[i].name = groupName;
                $scope.groups[i].description =  groupDescription;

                //Función hacia la API
            }
        }
    }

    $scope.unfollowGroup = function(id){
        
        console.log(id);
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

})

.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick;
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$apply(clickAction)
                        }
                    });
                }
            };
    }])

.controller('LoginCtrl', function ($scope, $routeParams) {
    $scope.socialNetwork = $routeParams.socialNetwork;
});
