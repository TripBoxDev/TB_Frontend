app.factory('authService', function($rootScope, $log) {
    var authManagement = {
        data: {
        	/* Flag to check if we are during a login process */
        	isLogging: false,
            isLogged: false,
        	userInfo: {},
            /* Contiene la url a la que se redireccionará despues de hacer login */
            redirectUrl: '/groups'

        },
        setIsLogging : function(isLogging) {
            $log.info('Logging status: ' + isLogging);
            this.data.isLogging = isLogging;

        	$rootScope.isLogging = isLogging;
        },

        setRedirectUrl : function(redirectUrl) {
            this.data.redirectUrl = redirectUrl;
            $log.info('RedirectUrl is now: ' + this.data.redirectUrl);
        }




    };
    return authManagement;

})