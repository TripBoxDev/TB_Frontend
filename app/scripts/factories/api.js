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

        putEditGroup: function(edit) {

            //Llamada PUT a la API para modificar el grupo deseado
            return $http.put(endpoint + 'group/', edit)

        },

        deleteGroupUser: function(datos) {

            //Se hace una petición de eliminación del usuario determinado al grupo pertinente
            return $http.delete(endpoint + 'group/' + datos.groupId + '/user/' + datos.userId);
            
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