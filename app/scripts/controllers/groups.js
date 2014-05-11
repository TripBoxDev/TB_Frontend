//Directivas para el correcto funcionamiento de subidas de ficheros con angularJS
app.directive('file', function(){
    return {
        scope: {
            file: '='
        },
        link: function(scope, el, attrs){
            el.bind('change', function(event){
                var files = event.target.files;
                scope.file = files[0];
                scope.$apply();
            });
        }
    };
});

//PETICION JSON HACIA LA API
app.controller("GroupsCtrl", function($scope, $http, authService, $modal) {
    var endpoint = 'http://tripbox.uab.es/TB_Backend2/api/';
    var imageDirectory = "http://tripbox.uab.cat/groupImgs/";

    //para hacer uso de $resource debemos colocarlo al crear el modulo

        
    var newUser = {
        name: "Cristian",
        lastName: "Correa",
        email: "cristiancorrea@gmail.com"  
    }/* 

    $http.put(endpoint + 'user/', newUser)
    .success(function(data) {
        console.log(data.id);
    });
    */

    //Usuario que inicia sesión con Facebook
    //var infoUser = authService.data.userInfo;
    var user = "MZmYP1NeUap7"; //nfoUser.id;
    
    //Lista de grupos del usuario
    $scope.groups = [];

    //Llamada GET a la API para coger los grupos
    $http.get(endpoint + 'user/' + user)
        .success(function(data, status) {

            //Recorre todos los grupos
            for (var i = data.groups.length - 1; i >= 0; i--) {
                $http.get(endpoint + 'group/' + data.groups[i])
                    .success(function(data, status) {

                        //Determina si es imagen personalizada o no
                        var ImagePath;
                        if(data.image == true){
                            ImagePath = imageDirectory + data.id;
                        } else {
                            ImagePath = imageDirectory + "default_img.png"
                        }

                        //Actualizamos la variable groups
                        $scope.groups.push({
                            id: data.id,
                            name: data.name,
                            description: data.description,
                            imagePath: ImagePath
                        })
                    });
            }
        }).
    error(function(data, status) {
        console.log("error al obtener los grupos del usuario");
    });

    //console.log(authService.data);
    $scope.infoUser = newUser; //authService.data.userInfo;

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

            //Esto está para comprobar que se borra y tal
            console.log(idGroup);

            //El id del usuario
            var userId = user;

            //Se hace una petición de eliminación del usuario determinado al grupo pertinente
            $http.delete(endpoint + 'group/' + idGroup + '/user/' + userId)
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

    //Limpia el formulario de añadir grupo
    $scope.cleanFormAddGroup = function(){
        
        //Limpia los datos internos del navegador del formulario
        $scope.formAddGroup.$setPristine();

        //Limpia la parte visible del formulario
        var defaultForm = {
            name : "",
            description : ""
        };
        $scope.newGroup = defaultForm;

        //NOTA: Como en defaultForm no se define nada para el
        //campo de imagen, también se limpia. Es una forma fea
        //de hacerlo pero eh, funciona.
    }

    $scope.addGroup = function(submittedGroup) {

        
        //Usuario que crea el grupo
        var userId = user;

        //Nuevo grupo
        var newGroup = {
            name: submittedGroup.name,
            description: submittedGroup.description
        };

        //Llamada PUT a la API para insertar el nuevo grupo
        $http.put(endpoint + 'group', newGroup)
            .success(function(createdGroup, status) {

                var newGroupWithId = {
                    id: createdGroup.id,
                    name: createdGroup.name,
                    description: createdGroup.description
                }

                console.log("Id del grupo creado: " + createdGroup.id);

                //Llamada PUT a la API para insertar el id del grupo al usuario y el id del usuario al grupo 
                $http.put(endpoint + 'user/' + userId + '/group/' + createdGroup.id)
                    .success(function(data, status) {
                        console.log("Grupo creado correctamente!");

                        //Se comprueba si existe imagen
                        var imagen = $scope.param;

                        //Si se ha tratado de subir una imagen
                        if(imagen != undefined){
                            //La imagen se saca de scope.param.file
                            imagen = $scope.param.file;

                            //Se sube la imagen al servidor
                            $http.put("http://tripbox.uab.cat/TB_Backend2/api/group/" + createdGroup.id + "/image", imagen, {headers: {"Content-Type":"image/jpeg"}});

                            //Se borra la referencia a la imagen para poder subir otras en el futuro
                            $scope.param = undefined;
                        }

                        //Limpia el formulario
                        $scope.cleanFormAddGroup();

                        $scope.groups.push(newGroupWithId);
                    }).
                error(function(data, status) {
                    console.log("Error al hacer la llamada a /user/id/group/id!");
                });

            })
            .error(function(data, status) {
                console.log("Error al insertar grupo!");
            });
    };

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