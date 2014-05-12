app.factory('ApiService', function($http, $location, authService, ErrorHandler, $log) {
    
    var endpoint = 'http://tripbox.uab.cat/TB_Backend/api/';
    return {
        
        loginUser: function(data) {
            console.log(data);
            $http.put(endpoint + 'user', data)
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
            $log.info('API logout user');
            authService.data.isLogged = false;

            $location.path('/');

            authService.setIsLogging(false);



        }, 

        getGroup: function(groupId){
             
             return $http.get(endpoint + 'group/' + groupId);
           
        },
        
        putGroup: function(newGroup) {

            //Llamada PUT a la API para insertar el nuevo grupo
            return $http.put(endpoint + 'group', newGroup);
                
        },
        
        putUserGroup: function(datos) {

            //Llamada PUT a la API para insertar el id del grupo al usuario y el id del usuario al grupo 
            return $http.put(endpoint + 'user/' + datos.userId + '/group/' + datos.groupId);
            
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
        },
        sendInvitations: function(mailsArray, groupId, callback) {
            var data = {
                "invitationUrl" : "http://tripbox.uab.cat/" + groupId,
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