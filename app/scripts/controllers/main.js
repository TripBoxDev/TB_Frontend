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

    //Crear un nuevo usuario de prueba

    /*
    var newUser = {
        name: "Cristian",
        lastName: "Correa",
        email: "cristiancorrea@gmail.com"  
    }

    $http.put('http://tripbox.uab.cat/TB_Backend/api/user/', newUser)
    .success(function(data) {
        console.log(data.id);
    });
    */

    //Usuario que inicia sesión con Facebook
    var user = "UDmoa62fS4sN";

    //Lista de grupos del usuario
    $scope.groups = [];
    $scope.infoUser = [];

    //Llamada GET a la API para coger los grupos
    $http.get('http://tripbox.uab.cat/TB_Backend/api/user/' + user)
        .success(function(data, status) {

            //Recorre todos los grupos
            for (var i = data.groups.length - 1; i >= 0; i--) {
                $http.get('http://tripbox.uab.cat/TB_Backend/api/group/' + data.groups[i])
                    .success(function(data, status) {

                        //Actualizamos la variable groups
                        $scope.groups.push({
                            id: data.id,
                            name: data.name,
                            description: data.description
                        })
                    });
            }
        }).
    error(function(data, status) {
        console.log("error al obtener los grupos del usuario");
    });

    //LLlamada a la API para coger el nombre del usuario
    $http.get('http://tripbox.uab.cat/TB_Backend/api/user/' + user)
        .success(function(data, status) {
            $scope.infoUser = data;
        }).
    error(function(data, status) {
        console.log("error al cargar la información del usuario");
    });


    $scope.addGroup = function(groupName, groupDescription) {

        //Usuario que crea el grupo
        var userId = "UDmoa62fS4sN";

        //Nuevo grupo
        var newGroup = {
            name: groupName,
            description: groupDescription
        };


        //Llamada PUT a la API para insertar el nuevo grupo
        $http.put('http://tripbox.uab.cat/TB_Backend/api/group', newGroup)
            .success(function(data, status) {

                var newGroupWithId = {
                    id: data.id,
                    name: data.name,
                    description: data.description
                }

                $scope.groups.push(newGroupWithId);

                console.log("id del grupo creado: " + data.id);

                //Llamada PUT a la API para insertar el id del grupo al usuario y el id del usuario al grupo 
                $http.put('http://tripbox.uab.cat/TB_Backend/api/user/' + userId + '/group/' + data.id)
                    .success(function(data, status) {
                        console.log("grupo creado correctamente");
                    }).
                error(function(data, status) {
                    console.log("error al hacer la llamada a /user/id/group/id");
                });

            }).
        error(function(data, status) {
            console.log("error al insertar grupo");
        });
    };

    $scope.editGroup = function(id, groupName, groupDescription) {
        for (var i = $scope.groups.length - 1; i >= 0; i--) {
            if ($scope.groups[i].id == id) {
                $scope.groups[i].name = groupName;
                $scope.groups[i].description = groupDescription;

                //Función hacia la API
                /*
                $http.put('http://tripbox.uab.cat/TB_Backend/api/group', {name:groupName, description:groupDescription})
                */
            }
        }
    };

    $scope.unfollowGroup = function(idGroup) {

        //Esto está para comprobar que se borra y tal
        console.log(idGroup);

        //El id del usuario
        var userId = "UDmoa62fS4sN";

        //Se hace una petición de eliminación del usuario determinado al grupo pertinente
        $http.delete('http://tripbox.uab.cat/TB_Backend/api/group/' + idGroup + '/user/' + userId)
            .success(function(data, status) {

                //Si funciona:
                //Representa el borrado gráficamente

                //Busca en el conjunto de grupos...
                for (var i = $scope.groups.length - 1; i >= 0; i--) {
                    //Uno cuya id sea igual al borrado...
                    if ($scope.groups[i].id == idGroup) {
                        //Y lo elimina de la lista
                        $scope.groups.splice(i, 1);
                    }
                }
            });
    };

    $scope.checkName = function(data) {
        if (data !== '') {
            return "Un grupo debe tener nombre";
        }
    };

    $scope.saveGroup = function(data, id) {
        //$scope.user not updated yet
        angular.extend(data, {
            id: id
        });
        //return $http.post('/saveUser', data);
    };

    // remove user
    $scope.removeGroup = function(index) {
        $scope.groups.splice(index, 1);
    };

})

.directive('ngConfirmClick', [
    function() {
        return {
            link: function(scope, element, attr) {
                var msg = attr.ngConfirmClick;
                var clickAction = attr.confirmedClick;
                element.bind('click', function(event) {
                    if (window.confirm(msg)) {
                        scope.$apply(clickAction)
                    }
                });
            }
        };
    }
])

.controller('LoginCtrl', function($scope, $routeParams) {
    $scope.socialNetwork = $routeParams.socialNetwork;
});