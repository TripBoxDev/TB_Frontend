app.factory('ApiService', function($http, $routeParams, $location, authService, ErrorHandler, $log, $q) {

    var endpoint = 'http://tripbox.uab.cat/TB_Backend/api/';
    return {

        loginUser: function(data) {

            var deferred = $q.defer();
            $log.info('Haciendo loginUser en API');
            $http.put(endpoint + 'user', data)
                .success(function(data, status, headers, config) {
                    $log.info('Dentro de success loginuser API');
                    deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $log.info('Dentro de error loginuser API');
                    deferred.reject();

                });
            return deferred.promise;
        },
        logoutUser: function() {
            $log.info('API logout user');
            authService.data.isLogged = false;

        },

        addUserToGroup: function(groupId) {
            return $http.put(endpoint + 'user/' + authService.data.userInfo.id + '/group/' + groupId);
        },

        getUser: function(user) {

            //Llamada GET para pedir los datos de un usuario
            return $http.get(endpoint + 'user/' + user);

        },

        getGroup: function(groupId) {

            //Llamada GET para consultar los grupos de un usuario
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

        unFollowGroupUser: function(datos) {

            //Se hace una petición de eliminación del usuario determinado al grupo pertinente
            return $http.delete(endpoint + 'group/' + datos.groupId + '/user/' + datos.userId);

        },

        sendInvitations: function(mailsArray, groupId, callback) {
            var data = {
                "invitationUrl": "http://tripbox.uab.cat/#/groups/" + groupId + "/invitation/true",
                "emails": mailsArray
            };
            return $http.put(endpoint + 'email/invitation', data);

        },

        putTransportCard: function(groupId, transportCard) {
            return $http.put(endpoint + 'group/' + groupId + '/transportCard', transportCard);
        },

        /**
         * Añade o modifica una card de tipo place2Sleep
         */
        putPlaceToSleepCard: function(groupId, placeToSleepCard) {
            return $http.put(endpoint + 'group/' + groupId + '/placeToSleepCard', placeToSleepCard);

        },
        /**
         * Añade o modifica una card de tipo other
         */
        putOtherCard: function(groupId, otherCard) {
            return $http.put(endpoint + 'group/' + groupId + '/otherCard', otherCard);

        },

        putVote: function(cardId, newVote) {
            return $http.put(endpoint + 'group/' + $routeParams.groupId + '/card/' + cardId + '/vote', newVote);

        },

        deleteDestination: function(destino) {
            return $http.put(endpoint + 'group/' + $routeParams.groupId + '/destination/', destino, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

        },

        putDestination: function(destino) {
            return $http.put(endpoint + 'group/' + $routeParams.groupId + '/destination/', destino, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

        }
    }
})