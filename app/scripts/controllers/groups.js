//PETICION JSON HACIA LA API
app.controller("GroupsCtrl", function($scope, $http, authService, ApiService, $modal) {
    var endpoint = 'http://tripbox.uab.es/TB_Backend/api/';

    //para hacer uso de $resource debemos colocarlo al crear el modulo

    /*     
    var newUser = {
        name: "Cristian",
        lastName: "Correa",
        email: "cristiancorrea@gmail.com"  
    }

    $http.put(endpoint + 'user/', newUser)
    .success(function(data) {
        console.log(data.id);
    });
    */

    //Usuario que inicia sesión con Facebook
    var infoUser = authService.data.userInfo;
    var user = infoUser.id;

    $scope.infoUser = authService.data.userInfo;
    //Lista de grupos del usuario
    $scope.groups = [];

    //Llamada GET a la API para coger los grupos
    $http.get(endpoint + 'user/' + user)
        .success(function(data, status) {

            //Recorre todos los grupos
            for (var i = data.groups.length - 1; i >= 0; i--) {
                $http.get(endpoint + 'group/' + data.groups[i])
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
    /*
    $scope.addGroup = function(submittedGroup) {
        
        console.log(submittedGroup);
        console.log("Entre en funcion addGroup groups.js")
        ApiService.addGroup(submittedGroup);
        console.log("Vuelve a groups.js");
    }

    */

    $scope.editGroup = function(idGroup, groupName, groupDescription) {

        var editGroupModalInstance = $modal.open({
            templateUrl: 'editGroupModalContent.html',
            controller: 'editGroupModalInstanceCtrl',
            resolve: {
                idGroup: function() {
                    return idGroup;
                },
                groupName: function() {
                    return groupName;
                },
                groupDescription: function() {
                    return groupDescription;
                }
            }
        });


        editGroupModalInstance.result.then(function(edit) {

            //Llamada PUT a la API para insertar el nuevo grupo
            $http.put(endpoint + 'group/', edit)
                .success(function(data, status) {

                    //Lista de grupos del usuario
                    $scope.groups = [];

                    //Llamada GET a la API para coger los grupos
                    $http.get(endpoint + 'user/' + user)
                        .success(function(data, status) {

                            //Recorre todos los grupos
                            for (var i = data.groups.length - 1; i >= 0; i--) {
                                $http.get(endpoint + 'group/' + data.groups[i])
                                    .success(function(data, status) {

                                        //Actualizamos la variable groups
                                        $scope.groups.push({
                                            id: data.id,
                                            name: data.name,
                                            description: data.description
                                        })
                                    });
                            }
                        });

                });

        });

    };



    $scope.unFollowGroup = function(idGroup, groupName) {

        var unFollowGroupModalInstance = $modal.open({
            templateUrl: 'unFollowGroupModalContent.html',
            controller: 'unFollowGroupModalInstanceCtrl',
            resolve: {
                idGroup: function() {
                    return idGroup;
                },
                groupName: function() {
                    return groupName;
                }
            }
        });

        unFollowGroupModalInstance.result.then(function(selectedItem) {
            // Esta función se ejecuta cuando desde el modalInstance controller
            // se ejecuta $modalInstance.close().

            //El id del usuario
            var userId = user;

            //Se hace una petición de eliminación del usuario determinado al grupo pertinente
            $http.delete(endpoint + 'group/' + idGroup + '/user/' + userId)
                .success(function(data, status) {
                    console.log("Grupo eliminado");
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
        });

    };


    $scope.checkName = function(data) {
        if (data !== '') {
            return "Un grupo debe tener nombre";
        }
    };


    // remove user
    $scope.removeGroup = function(index) {
        $scope.groups.splice(index, 1);
    };



    $scope.addGroup = function(submittedGroup) {

        //Usuario que crea el grupo
        var userId = user;

        //Nuevo grupo
        var newGroup = {
            name: submittedGroup.name,
            description: submittedGroup.description
        };
        
        ApiService.putGroup(newGroup).success(function(data, status) {

            var newGroupWithId = {
                id: data.id,
                name: data.name,
                description: data.description
            };

            var datos = {
                groupId: newGroupWithId.id,
                userId: userId
            };

            ApiService.putUserGroup(datos).success(function(data, status) {

                //Limpia el formulario
                $scope.formAddGroup.$setPristine();
                var defaultForm = {
                    name: "",
                    description: ""
                };
                $scope.newGroup = defaultForm;

                $scope.groups.push(newGroupWithId);

            //Fin del parentesis del 2o success
            })

            .error(function(data, status) {
                console.log("Error al hacer la llamada a /user/id/group/id!");
            });

        //Fin del parentesis del 1er success
        })

        .error(function(data, status) {
            console.log("Error al insertar grupo!");
        });

    //Fin del parentesis addGroup
    };




    //Fin del parentesis app.controller y function
});


app.controller('unFollowGroupModalInstanceCtrl', function($scope, $modalInstance, ApiService, idGroup, groupName) {
    $scope.idGroup = idGroup;
    $scope.groupName = groupName;
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.confirmUnFollow = function() {
        $modalInstance.close();

    }
});

app.controller('editGroupModalInstanceCtrl', function($scope, $modalInstance, ApiService, idGroup, groupName, groupDescription) {

    $scope.idGroup = idGroup;
    $scope.groupName = groupName;
    $scope.groupDescription = groupDescription;

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.confirmEdit = function(groupName, groupDescription) {
        var edit = {
            id: idGroup,
            name: groupName,
            description: groupDescription
        }
        $modalInstance.close(edit);
    }
});