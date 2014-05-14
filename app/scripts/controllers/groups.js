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
app.controller("GroupsCtrl", function($scope, $http, authService, ApiService, $modal) {
    var endpoint = 'http://tripbox.uab.es/TB_Backend2/api/';
    var imageDirectory = "http://tripbox.uab.cat/groupImgs/";

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

                        //Determina si es imagen personalizada o no
                        var ImagePath;
                        if(data.flagImage == true){
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

    //Muestra un nuevo grupo al crearlo. Se ha puesto como función a parte porque la subia de imagenes
    //incluye un nuevo sucess si se sube una, pero no lo incluye si no se hace.
    //Como éste codigo debe estar dentro del success pero también debe estar fuera para la excepción a
    //la vez, se llama en forma de función para ambos.
    $scope.showNewGroup = function(createdGroup, ImagePath){
         //Limpia el formulario
        $scope.cleanFormAddGroup();

        //Objeto visible de grupo
        var newGroupWithId = {
            id: createdGroup.id,
            name: createdGroup.name,
            description: createdGroup.description,
            imagePath: ImagePath
        }

        console.log(newGroupWithId.imagePath);

        $scope.groups.push(newGroupWithId);
    };

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
        ApiService.putGroup(newGroup).success(function(createdGroup, status) {
            var datos = {
                groupId: createdGroup.id,
                userId: userId
            };

            //Hacemos la llamada de putGroupUser para añadir el usuario a el grupo creado de api.js
            ApiService.putUserGroup(datos).success(function(data, status) {

                //Se comprueba si existe imagen
                var imagen = $scope.param;

                //Path de la imagen del grupo que se crea
                var ImagePath;

                //Si se ha tratado de subir una imagen
                if(imagen != undefined){
                    //La imagen se saca de scope.param.file
                    imagen = $scope.param.file;

                    //Se sube la imagen al servidor
                    $http.put("http://tripbox.uab.cat/TB_Backend2/api/group/" + createdGroup.id + "/image", imagen, {headers: {"Content-Type":"image/jpeg"}}).success(function(data,status) {
                                
                        //Se borra la referencia a la imagen para poder subir otras en el futuro
                        $scope.param = undefined;

                        //El path a la imagen es el directorio de la imagen y el ID
                        ImagePath = imageDirectory + createdGroup.id + ".jpg";

                        //Muestra el grupo nuevo
                        $scope.showNewGroup(createdGroup, ImagePath);

                    });
                } else {

                    //La imagen es la de defecto, y eso es todo
                    ImagePath = imageDirectory + "default_img.png"

                    //Muestra el grupo nuevo
                    $scope.showNewGroup(createdGroup, ImagePath);
                }

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

            console.log(edit);

            //Carga datos actuales del grupo
             ApiService.getGroup(edit.id)
                .success(function(data, status) {

                        console.log(data);

                        var editedGroup = data;

                        console.log(editedGroup);

                        editedGroup.name = edit.name;
                        editedGroup.description = edit.description;

                        //Llamada PUT a la API para insertar el nuevo grupo
                        ApiService.putEditGroup(editedGroup)
                            .success(function(data2, status) {

                                console.log(data2);

                                //Lista de grupos del usuario
                                $scope.groups = [];

                                //Llamada GET a la API para coger los grupos

                                //ESTA PARTE SE TIENEN QUE CAMBIAR!!!!

                                $http.get(endpoint + 'user/' + user)
                                    .success(function(data3, status) {

                                        console.log("Verga");

                                        //Recorre todos los grupos
                                        for (var i = data3.groups.length - 1; i >= 0; i--) {
                                            $http.get(endpoint + 'group/' + data3.groups[i])
                                                .success(function(data4, status) {

                                                    console.log("pene");
                                                    console.log(data4);

                                                    //Determina si es imagen personalizada o no
                                                    var ImagePath;
                                                    if(data4.flagImage == true){
                                                        ImagePath = imageDirectory + data4.id;
                                                    } else {
                                                        ImagePath = imageDirectory + "default_img.png"
                                                    }

                                                    //Actualizamos la variable groups
                                                    $scope.groups.push({
                                                        id: data4.id,
                                                        name: data4.name,
                                                        description: data4.description,
                                                        imagePath: ImagePath
                                                    })
                                                });
                                        }
                                    });

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