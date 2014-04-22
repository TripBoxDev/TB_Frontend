app.factory('authService', function() {
    var authManagement = {
        data: {
            isLogged: false,
        	userInfo: {}

        },


    };
    return authManagement;

})