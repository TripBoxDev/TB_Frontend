app.factory('ApiService', function($http, $location, authService, ErrorHandler) {
    return {
        endpoint: 'http://tripbox.uab.cat/TB_Backend/api',
        loginUser: function(data) {
            console.log(data);
            $http.put(this.endpoint + '/user', data)
                .success(function(data, status, headers, config) {

                    authService.data.isLogged = true;

                    authService.data.userInfo = data;

                    // Redirect to groups
                    $location.path('/groups');
                    authService.setIsLogging(false);



                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.

                    console.log('API returned an error');
                    ErrorHandler.redirectError();
                    authService.setIsLogging(false);

                });

        },
        logoutUser: function() {
            authService.data.isLogged = false;
            $location.path('/');


        },

        addGroup: function(submittedGroup) {

            console.log("Entre en funcion addGroup api.js")

            var endpoint = this.endpoint;

            //Usuario que crea el grupo
            var userId = authService.data.userInfo.id;
           
            console.log("id usuario: " + userId);

            //Nuevo grupo
            var newGroup = {
                name: submittedGroup.name,
                description: submittedGroup.description
            };

            console.log("Nuevo grupo: " + newGroup);

            //Llamada PUT a la API para insertar el nuevo grupo
            $http.put(endpoint + '/group', newGroup)
                .success(function(data, status) {

                    var newGroupWithId = {
                        id: data.id,
                        name: data.name,
                        description: data.description
                    }

                    console.log("Grupo enviado: " + newGroupWithId)
                    console.log("Id del grupo creado: " + data.id);

                    console.log("Id usuario = " + userId);

                    //Llamada PUT a la API para insertar el id del grupo al usuario y el id del usuario al grupo 
                    $http.put(endpoint + '/user/' + userId + '/group/' + data.id)
                        .success(function(data, status) {
                            console.log("Grupo creado correctamente:" + data);


                            //Limpia el formulario
                            /*
                            $scope.formAddGroup.$setPristine();
                            var defaultForm = {
                                name: "",
                                description: ""
                            };
                            $scope.newGroup = defaultForm;

                            $scope.groups.push(newGroupWithId);
                            */
                        }).
                    error(function(data, status) {
                        console.log("Error al hacer la llamada a /user/id/group/id!");
                    });

                })
                .error(function(data, status) {
                    console.log("Error al insertar grupo!");
                });

        },

        editGroup: function(idGroup, groupName, groupDescription) {

            console.log("Entre en funcion de api.js")

            console.log(idGroup, groupName, groupDescription);

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
                $http.put(this.endpoint + 'group/', edit)
                    .success(function(data, status) {

                        //Lista de grupos del usuario
                        $scope.groups = [];

                        //Llamada GET a la API para coger los grupos
                        $http.get(this.endpoint + 'user/' + user)
                            .success(function(data, status) {

                                //Recorre todos los grupos
                                for (var i = data.groups.length - 1; i >= 0; i--) {
                                    $http.get(this.endpoint + 'group/' + data.groups[i])
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

        },

        unFollowGroup: function(idGroup, groupName) {

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

                //Esto está para comprobar que se borra y tal
                console.log(idGroup);

                //El id del usuario
                var userId = user;

                //Se hace una petición de eliminación del usuario determinado al grupo pertinente
                $http.delete(this.endpoint + 'group/' + idGroup + '/user/' + userId)
                    .success(function(data, status) {

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

        },

        removeGroup: function(index) {
            $scope.groups.splice(index, 1);
        },

        sendInvitations: function(mailsArray, groupId, callback) {
            var data = {
                "invitationUrl": "http://tripbox.uab.cat/" + groupId,
                "emails": mailsArray
            };
            $http.put(this.endpoint + '/email/invitation', data)
                .success(function() {
                    console.log('Successful!');
                })
                .error(function() {
                    console.error('Fail absoluto');
                })
        }
    }
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