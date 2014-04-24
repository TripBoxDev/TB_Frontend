app.factory('ApiService', function($http, $location, authService, ErrorHandler) {
    return {
        endpoint: 'http://tripbox.uab.cat/TB_Backend/api',
        loginUser: function(data) {
            console.log(data);
            $http.put(this.endpoint + '/user', data)
                .success(function(data, status, headers, config) {

                    authService.data.isLogged = true;

                    // Redirect to groups
                    $location.path('/groups');



                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.

                    console.log('API returned an error');
                    ErrorHandler.redirectError();
                });
        },
        logoutUser: function() {
            authService.data.isLogged = false;
            $location.path('/');


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
            console.log(idGroup);

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
        }
    }
})