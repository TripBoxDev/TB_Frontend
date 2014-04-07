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
            .success(function(result) {

                //Si ha funcionado, recorre cada grupo de viaje al que pertenece el usuario
                for (var i = result["groups"].length - 1; i >= 0; i--) {
                    //Lee los datos del grupo
                    $http.get('http://tripbox.uab.cat/TB_Backend/api/group/' + result["groups"][i])
                        .success(function(result) {

                            //Y si ha salido todo bien, añade a la lista del grupo los datos del grupo recién leido
                            $scope.groups.push({
                                id: result["id"],
                                name: result["name"],
                                description: result["description"]
                            })

                        });
                };
            });

        $scope.addGroup = function(groupName, groupDescription) {

            var userId = "123456"

            //Inicializa una varaible que representa
            //el nuevo grupo con las especificaciones dadas
            var newGroup = {
                name: groupName,
                description: groupDescription,
                users: [ userId ]
            };

            //Crea el nuevo grupo con una petición a BackEnd
            $http.put('http://tripbox.uab.cat/TB_Backend/api/group',newGroup)
            .success(function(grupo) {

                //Si ha funcionado:
                //Hace get para recuperar el objeto del usuario
                $http.get('http://tripbox.uab.cat/TB_Backend/api/user/' + userId)
                        .success(function(usuario) {

                            //Si ha funcionado:
                            //Coje la array que almacena los grupos
                            //y añade la id del grupo,
                            //creando un objeto "User" actualizado
                            usuario.groups.push(grupo.id);

                            //Finalmente hace put de este nuevo user,
                            //y como esta Id ya es existente, substituye
                            //al anterior
                            $http.put('http://tripbox.uab.cat/TB_Backend/api/user/',usuario)
                            .success(function(data, status) {

                                //Ahora que está todo en orden
                                //muestra gráficamente el grupo nuevo
                                $scope.groups.push({
                                id: grupo.id,
                                name: grupo.name,
                                description: grupo.description
                                })

                                //TODO: Esta función es la misma que sale arriba.
                                //Quizá se pueda poner en una sola y llamarla pasándole parámetros.

                            }); //endPutUser
                        }); //endGetUSer
            }). //endPutNewGroup
            error(function(data, status) {
                //En caso de error al crear el nuevo grupo
                //TODO: POR HACER
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
                var userId = "123456";

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