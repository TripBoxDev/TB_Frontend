//PETICION JSON HACIA LA API
app.controller("GroupsCtrl", function($scope, $http) {
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
    var user = "UDmoa62fS4sN";
    
    //Lista de grupos del usuario
    $scope.groups = [];
    $scope.infoUser = [];

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

    //LLlamada a la API para coger el nombre del usuario
    $http.get(endpoint + 'user/' + user)
        .success(function(data, status) {
            $scope.infoUser = data;
        }).
    error(function(data, status) {
        console.log("error al cargar la información del usuario");
    });

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

    $scope.unFollowGroup = function(idGroup) {

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

});