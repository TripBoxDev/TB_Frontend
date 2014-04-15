app.factory('authService', function() {
    var authManagement = {
        data: {
            isLogged: false
        }

    };
    return authManagement;

})