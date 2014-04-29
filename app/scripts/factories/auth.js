app.factory('authService', function($rootScope) {
    var authManagement = {
        data: {
        	/* Flag to check if we are during a login process */
        	isLogging: false,
            isLogged: false,
        	userInfo: {}

        },
        setIsLogging : function(isLogging) {
        	this.isLogging = isLogging;

        	$rootScope.isLogging = isLogging;
        }


    };
    return authManagement;

})