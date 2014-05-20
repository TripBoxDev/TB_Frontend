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
    var endpoint = 'http://tripbox.uab.es/TB_Backend/api/';
    var imageDirectory = "http://tripbox.uab.cat/groupImgs/";

    //Usuario que inicia sesión con Facebook
    var infoUser = authService.data.userInfo;
    var user = infoUser.id;

    $scope.infoUser = authService.data.userInfo;
    $scope.groups = [];
    
    //Con esto evitamos el parpadeo
    $scope.groupsTuto = infoUser.groups;

    //Función comun que carga (o recarga) los grupos de un usuario
    $scope.reloadGroups = function (){
            //Lista de grupos del usuario
            $scope.groups = [];

            //Llamada GET a la API para coger los grupos

            //ESTA PARTE SE TIENEN QUE CAMBIAR!!!!

            $http.get(endpoint + 'user/' + user).success(function(listOfGroups, status) {

                //Recorre todos los grupos
                for (var i = listOfGroups.groups.length - 1; i >= 0; i--) {
                    $http.get(endpoint + 'group/' + listOfGroups.groups[i]).success(function(groupPointer, status) {

                    //Determina si es imagen personalizada o no
                    var ImagePath;
                    if(groupPointer.flagImage == true){
                        ImagePath = imageDirectory + groupPointer.id;
                    } else {
                        ImagePath = imageDirectory + "default_img.png"
                    }

                    //Actualizamos la variable groups
                    $scope.groups.push({
                        id: groupPointer.id,
                        name: groupPointer.name,
                        description: groupPointer.description,
                        imagePath: ImagePath
                    })
                });
                }
            }).
            error(function(data, status) {
                console.log("error al obtener los grupos del usuario");
            });
    }

    //Con la función de reloadGroups definida, llamarla al entrar en la página
    $scope.reloadGroups();

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
                    $http.put(endpoint + "group/" + createdGroup.id + "/image", imagen, {headers: {"Content-Type":"image/jpeg"}}).success(function(data,status) {
                                
                        //Se borra la referencia a la imagen para poder subir otras en el futuro
                        $scope.param = undefined;

                        //El path a la imagen es el directorio de la imagen y el ID
                        ImagePath = imageDirectory + createdGroup.id + ".jpg";

                        //Muestra el grupo nuevo
                        $scope.showNewGroup(createdGroup, ImagePath);
                        $scope.groupsTuto.push(newGroup);

                    });
                } else {

                    //La imagen es la de defecto, y eso es todo
                    ImagePath = imageDirectory + "default_img.png"

                    //Muestra el grupo nuevo
                    $scope.showNewGroup(createdGroup, ImagePath);
                    //Aumenta el grupo para mostrar el tutorial
                    $scope.groupsTuto.push(newGroup);

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

        console.log($scope.param);

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

            //Carga datos actuales del grupo
             ApiService.getGroup(edit.id)
                .success(function(actualGroup, status) {

                        var editedGroup = actualGroup;

                        editedGroup.name = edit.name;
                        editedGroup.description = edit.description;

                        //Llamada PUT a la API para insertar el nuevo grupo
                        ApiService.putEditGroup(editedGroup)
                            .success(function(editedGroup, status) {

                                //Se comprueba si existe imagen
                                var imagen = edit.image;

                                if(imagen != undefined){
                                //La imagen se saca de scope.param.file
                                imagen = imagen.file;

                                //Se sube la imagen al servidor
                                $http.put(endpoint + "group/" + edit.id + "/image", imagen, {headers: {"Content-Type":"image/jpeg"}}).success(function(data,status) {

                                    $scope.reloadGroups();

                                });

                                } else {

                                    $scope.reloadGroups();

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
            description: groupDescription,
            image: this.param
        }
        $modalInstance.close(edit);
    }
});