app.factory('ApiService', function($http, $location, authService, ErrorHandler, $log, $q) {
    return {
        endpoint: 'http://tripbox.uab.cat/TB_Backend/api',
        loginUser: function(data) {
            
            console.log(data);
            $http.put(this.endpoint + '/user', data)
                .success(function(data, status, headers, config) {
                    debugger;
                    authService.data.isLogged = true;

                    authService.data.userInfo = data;

                    $location.path(authService.data.redirectUrl);

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
            $log.info('API logout user');
            authService.data.isLogged = false;

            $location.path('/');

            authService.setIsLogging(false);



        },

        addUserToGroup : function(groupId) {
            
            var deferred = $q.defer();


            $log.info('Añade usuario a grupo ' + groupId);
            $http.put(this.endpoint + '/user/' + authService.data.userInfo.id + '/group/' + groupId)
            .success(function(data, status, headers, config) {
                $log.info('Añadido usuario al grupo exitosamente');
                deferred.resolve(data);
            })
            .error(function(data, status, headers, config) {
                ErrorHandler.redirectError();
                deferred.reject(data);
            });
            
            return deferred.promise;

            // TODO Hacer llamada a la API para añadir el usuario actual al grupo correspondiente
        },
        addGroup: function(groupName, groupDescription) {

            //Usuario que crea el grupo
            var userId = "UDmoa62fS4sN";

            //Nuevo grupo
            var newGroup = {
                name: groupName,
                description: groupDescription
            };


            //Llamada PUT a la API para insertar el nuevo grupo
            $http.put(endpoint + 'group', newGroup)
                .success(function(data, status) {

                    var newGroupWithId = {
                        id: data.id,
                        name: data.name,
                        description: data.description
                    }

                    $scope.groups.push(newGroupWithId);

                    console.log("Id del grupo creado: " + data.id);

                    //Llamada PUT a la API para insertar el id del grupo al usuario y el id del usuario al grupo 
                    $http.put(endpoint + 'user/' + userId + '/group/' + data.id)
                        .success(function(data, status) {
                            console.log("Grupo creado correctamente!");
                        }).
                    error(function(data, status) {
                        console.log("Error al hacer la llamada a /user/id/group/id!");
                    });

                }).
            error(function(data, status) {
                console.log("Error al insertar grupo!");
            });



        },

        editGroup: function(id, groupName, groupDescription) {
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
        },

        unFollowGroup: function(idGroup) {

            //Esto está para comprobar que se borra y tal
            console.log('Unfollow group: ' + idGroup);

            //El id del usuario
            var userId = "UDmoa62fS4sN";

            //Se hace una petición de eliminación del usuario determinado al grupo pertinente
            $http.delete(endpoint + 'group/' + idGroup + '/user/' + userId)
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
        },

        saveGroup: function(data, id) {
            //$scope.user not updated yet
            angular.extend(data, {
                id: id
            });


        },

        removeGroup: function(index) {
            $scope.groups.splice(index, 1);
        },
        sendInvitations: function(mailsArray, groupId, callback) {
            var data = {
                "invitationUrl" : "http://tripbox.uab.cat/#/groups/" + groupId + "/invitation/true",
                "emails" : mailsArray
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
})