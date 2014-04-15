'use strict';

var FacebookData = {};
FacebookData.channel = 'https://mysite.com/channel.html';
FacebookData.fbAppId = '1567668726791128';
FacebookData.autoFbLogin = true;

angular.module('angulApp')
    .controller('MainCtrl', function($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    })
    .controller('LoginCtrl', function($scope, $routeParams, facebookAuthService) {

        $scope.socialNetwork = $routeParams.socialNetwork;


        $scope.loginFacebook = function() {
            facebookAuthService.login();
        };

        $scope.logout = function() {
            facebookAuthService.logout();
        }
    })

/**
 * Handles authentication with Facebook.
 */
.factory('facebookAuthService', function(ApiService) {
    var authManagement = {
        /**
         * Sends the query to log in to Facebook
         */
        login: function() {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    var uid = response.authResponse.userID;
                }
            }, {
                scope: 'email'
            });
        },
        /**
         * Sends the query to Facebook to retrieve user info
         */
        getUserInfo: function() {

            var _self = this;

            FB.api('/me', function(response) {

                // Prepares object to be sent to API
                var apiData = {
                    //facebookId: response.id,
                    name: response.first_name,
                    lastName: response.last_name,
                    email: response.email
                }


                // Send user info for API approval
                ApiService.loginUser(apiData);

            });

        },

        /**
         * Attaches a handler to the event triggered whenever Facebook's auth changes
         */
        watchAuthStatusChange: function() {

            var _self = this;

            FB.Event.subscribe('auth.authResponseChange', function(response) {

                if (response.status === 'connected') {
                    /* 
                     The user is already logged, 
                     is possible retrieve his personal info
                    */
                    _self.getUserInfo();

                    /*
                     This is also the point where you should create a 
                     session for the current user.
                     For this purpose you can use the data inside the 
                     response.authResponse object.
                    */

                } else {

                    ApiService.logoutUser();

                    /*
                     The user is not logged to the app, or into Facebook:
                     destroy the session on the server.
                    */

                }

            });

        },
        logout: function() {
            var _self = this;
            ApiService.logoutUser();
        }
    };
    return authManagement;

})
/**
 * Stores global status of user, like if it is logged or not.
 */
.factory('authService', function() {
    var authManagement = {
        data: {
            isLogged: false
        }

    };
    return authManagement;

})

//PETICION JSON HACIA LA API
.controller("GroupsCtrl", function($scope, $http) {

//para hacer uso de $resource debemos colocarlo al crear el modulo

    /*
    var newUser = {
        name: "Cristian",
        lastName: "Correa",
        email: "cristiancorrea@gmail.com"  
    }

    $http.put('http://tripbox.uab.cat/TB_Backend/api/user/', newUser)
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
    $http.get('http://tripbox.uab.cat/TB_Backend/api/user/' + user)
        .success(function(data, status) {

            //Recorre todos los grupos
            for (var i = data.groups.length - 1; i >= 0; i--) {
                $http.get('http://tripbox.uab.cat/TB_Backend/api/group/' + data.groups[i])
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
    $http.get('http://tripbox.uab.cat/TB_Backend/api/user/' + user)
        .success(function(data, status) {
            $scope.infoUser = data;
        }).
    error(function(data, status) {
        console.log("error al cargar la información del usuario");
    });


    $scope.addGroup = function(groupName, groupDescription) {

        //Usuario que crea el grupo
        var userId = "UDmoa62fS4sN";

        //Nuevo grupo
        var newGroup = {
            name: groupName,
            description: groupDescription
        };


        //Llamada PUT a la API para insertar el nuevo grupo
        $http.put('http://tripbox.uab.cat/TB_Backend/api/group', newGroup)
            .success(function(data, status) {

                var newGroupWithId = {
                    id: data.id,
                    name: data.name,
                    description: data.description
                }

                $scope.groups.push(newGroupWithId);

                console.log("id del grupo creado: " + data.id);

                //Llamada PUT a la API para insertar el id del grupo al usuario y el id del usuario al grupo 
                $http.put('http://tripbox.uab.cat/TB_Backend/api/user/' + userId + '/group/' + data.id)
                    .success(function(data, status) {
                        console.log("grupo creado correctamente");
                    }).
                error(function(data, status) {
                    console.log("error al hacer la llamada a /user/id/group/id");
                });

            }).
        error(function(data, status) {
            console.log("error al insertar grupo");
        });
    };

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

    $scope.unfollowGroup = function(idGroup) {

        //Esto está para comprobar que se borra y tal
        console.log(idGroup);

        //El id del usuario
        var userId = "UDmoa62fS4sN";

        //Se hace una petición de eliminación del usuario determinado al grupo pertinente
        $http.delete('http://tripbox.uab.cat/TB_Backend/api/group/' + idGroup + '/user/' + userId)
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

})
.factory('ApiService', function($http, $location, authService, ErrorHandler) {
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


        }
    }
})
    .controller('NavBarCtrl', function($scope, facebookAuthService) {
        $scope.leftLinks = [{
            name: 'Groups',
            route: 'groups'
        }, {
            name: 'Profile',
            route: 'profile'
        }];



        $scope.logout = function() {
            facebookAuthService.logout();
        }
    })

.run(function($rootScope, facebookAuthService, $location, authService) {

    (function(d) {
        var js, id = 'facebook-jssdk',
            ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/it_IT/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));

    window.fbAsyncInit = function() {
        FB.init({
            appId: FacebookData.fbAppId, // App ID
            //channelUrl: FacebookData.channel, // Channel File
            status: FacebookData.autoFbLogin, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true // parse XFBML
        });

        facebookAuthService.watchAuthStatusChange();

    };

    $rootScope.$on('$routeChangeSuccess', function(scope, currentRoute, prevRoute) {

        function isRestrictedView(currentRoute) {

            if(typeof currentRoute.access === "undefined" || typeof currentRoute.access.isFree === "undefined") {
                console.warn('There\'s a route without restriction policies. Restricted as default.');
                return true;

            } else if(currentRoute.access.isFree) {
                return false
            }

        }

        // Conditions to see a restricted view
        if (isRestrictedView(currentRoute) && !authService.data.isLogged) {
            if (currentRoute.templateUrl !== 'views/main.html') {
                $location.path('/');
                console.log('Should be logged in, redirecting to /');
            }
        }
    });

});