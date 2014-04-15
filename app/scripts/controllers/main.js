app





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

