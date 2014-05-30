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
app.controller("GroupsCtrl", function($scope, $http, authService, ApiService, $modal, $location) {
    var imageDirectory = "http://tripbox.uab.cat/groupImgs/";
    var defaultImagePath = "images/system/groups/default_img.jpg";

    //Usuario que inicia sesión con Facebook
    var infoUser = authService.data.userInfo;
    var user = infoUser.id;

    $scope.infoUser = authService.data.userInfo;
    $scope.groups = [];

    $scope.groupsTuto;
    if($scope.infoUser.groups.length > 0){
        $scope.groupsTuto = false;
    } else {
        $scope.groupsTuto = true;
    }

    //Lista de grupos del usuario
    $scope.groups = [];

    //Llamada GET a la API para coger los grupos
    ApiService.getUser(user).success(function(listOfGroups, status) {

        //Recorre todos los grupos
        for (var i = listOfGroups.groups.length - 1; i >= 0; i--) {
            ApiService.getGroup(listOfGroups.groups[i]).success(function(groupPointer, status) {

            //Determina si es imagen personalizada o no
            var ImagePath;
            if(groupPointer.flagImage == true){
                ImagePath = imageDirectory + groupPointer.id;
            } else {
                ImagePath = defaultImagePath;
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

        //Añade el grupo nuevo
        $scope.groups.push(newGroupWithId);

        //Aumenta el grupo para mostrar el tutorial
        $scope.groupsTuto = false;

    };
 $scope.goToGroup = function(groupId) {
        $location.path('groups/' + groupId);
}
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
            
            //Se crea un objeto para relacionar el grupo nuevo creado con el
            //usuario que se va a añadir a él
            var idGroup_User = {
                groupId: createdGroup.id,
                userId: userId
            };

            //Hacemos la llamada de putGroupUser para añadir el usuario a el grupo creado de api.js
            ApiService.putUserGroup(idGroup_User).success(function(data, status) {

                //Se comprueba si existe imagen
                var imagen = $scope.param;

                //Path de la imagen del grupo que se crea
                var ImagePath;

                //Si se ha tratado de subir una imagen
                if(imagen != undefined){
                    //La imagen se saca de scope.param.file
                    imagen = $scope.param.file;

                    //Se sube la imagen al servidor
                    ApiService.uploadImage(createdGroup.id, imagen).success(function(data,status) {
                                
                        //Se borra la referencia a la imagen para poder subir otras en el futuro
                        $scope.param = undefined;

                        //El path a la imagen es el directorio de la imagen y el ID
                        ImagePath = imageDirectory + createdGroup.id;

                        //Muestra el grupo nuevo
                        $scope.showNewGroup(createdGroup, ImagePath);

                    });
                } else {

                    //La imagen es la de defecto, y eso es todo
                    ImagePath = defaultImagePath;

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

    //Reemplaza un grupo por otro gráficamente
    //Parámetros: (editedGroup: nuevo grupo a insertar)
    $scope.replaceGroup = function (editedGroup) {

       //Busca en el conjunto de grupos...
        for (var i = $scope.groups.length - 1; i >= 0; i--) {
                               
            //Uno cuya id sea igual al borrado...
            if ($scope.groups[i].id == editedGroup.id) {

                //Si el grupo en edicion no tiene imagePath, se recupera
                //del existente.
                if(editedGroup.imagePath == undefined){
                    editedGroup.imagePath = $scope.groups[i].imagePath;
                }
        
                //Se substituye el elemento
                $scope.groups.splice(i, 1, editedGroup);
                               
            }       
        }          
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

                        //Llamada PUT a la API para modificar el grupo
                        ApiService.putEditGroup(editedGroup)
                            .success(function(editedGroup, status) {

                                //Se comprueba si existe imagen
                                var imagen = edit.image;

                                if(imagen != undefined){
                                //La imagen se saca de scope.param.file
                                imagen = imagen.file;

                                //Se sube la imagen al servidor
                                ApiService.uploadImage(edit.id, imagen).success(function(data,status) {
                                    
                                    //Si se ha cargado una imagen nueva, este es el nuevo path
                                    edit.imagePath = imageDirectory + editedGroup.id;
                                    $scope.replaceGroup(edit);

                                });

                                } else {

                                    //Si no se ha cargado una imagen nueva, se pone en undefined para que
                                    //en la funcion siguiente se recupere el valor anterior (asi se evita un parpadeo)
                                    edit.imagePath = undefined;
                                    $scope.replaceGroup(edit);

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