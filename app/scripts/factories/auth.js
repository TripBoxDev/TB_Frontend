app.factory('authService', function($rootScope, $log) {
    var authManagement = {
        data: {
            isLogged: false,
        	userInfo: {},
            /* Contiene la url a la que se redireccionará despues de hacer login */
            redirectUrl: '/groups'

        },
        setRedirectUrl : function(redirectUrl) {
            this.data.redirectUrl = redirectUrl;
            $log.info('RedirectUrl is now: ' + this.data.redirectUrl);
        },
        getRedirectUrl : function() {
            debugger;
            console.log('redirect url inside authservice: ' + this.data.redirectUrl);
            return (this.data.redirectUrl === "undefined") ? '/groups' : this.data.redirectUrl;
        }




    };
    return authManagement;

})