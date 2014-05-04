app.factory('authService', function($rootScope, $log) {
    var authManagement = {
        data: {
        	/* Flag to check if we are during a login process */
        	isLogging: false,
            isLogged: false,
        	userInfo: {}

        },
        setIsLogging : function(isLogging) {
            $log.info('Logging status: ' + isLogging);
                        debugger;

            this.isLogging = isLogging;

        	$rootScope.isLogging = isLogging;
        }


    };
    return authManagement;

})