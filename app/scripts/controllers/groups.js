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
    ApiService.getUser(user)
        .success(function(data, status) {

            //Recorre todos los grupos
            for (var i = data.groups.length - 1; i >= 0; i--) {
                    
                var groupId = data.groups[i];
                
                ApiService.getGroup(groupId)
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

    //funcion para crear grupos
    $scope.addGroup = function(submittedGroup) {

        //Usuario que crea el grupo
        var userId = user;

        //Nuevo grupo
        var newGroup = {
            name: submittedGroup.name,
            description: submittedGroup.description
        };

        //Hacemos la llamada de putGroup para añadir el grupo de api.js
        ApiService.putGroup(newGroup).success(function(data, status) {

            //Crea el nuevo grupo y los datos necesarios
            var newGroupWithId = {
                id: data.id,
                name: data.name,
                description: data.description
            };

            var datos = {
                groupId: newGroupWithId.id,
                userId: userId
            };

            //Hacemos la llamada de putGroupUser para añadir el usuario a el grupo creado de api.js
            ApiService.putUserGroup(datos).success(function(data, status) {

                //Limpiamos elformulario para dejarlo vacio
                $scope.formAddGroup.$setPristine();
                var defaultForm = {
                    name: "",
                    description: ""
                };
                $scope.newGroup = defaultForm;

                //Insertamos el grupo sin refresco en la pagina
                $scope.groups.push(newGroupWithId);

            //Fin del parentesis del 2o success
            })

            //Error al incluir un grupo
            .error(function(data, status) {
                console.log("Error al unir al usuario en el grupo creado!");
            });

        //Fin del parentesis del 1er success
        })
    
        //Error al crear un grupo
        .error(function(data, status) {
            console.log("Error al insertar grupo!");
        });

    //Fin del parentesis addGroup
    };

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
            ApiService.putEditGroup(edit)
                .success(function(data, status) {

                    //Lista de grupos del usuario
                    $scope.groups = [];

                    //Llamada GET a la API para coger los grupos

                    //ESTA PARTE SE TIENEN QUE CAMBIAR!!!!

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

            datos = {
                groupId: idGroup,
                userId: userId
            };

            //Hacemos la llamada de deleteGroupUser para eliminar un user de un grupo de api.js
            ApiService.unFollowGroupUser(datos).success(function(data, status) {
                   
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