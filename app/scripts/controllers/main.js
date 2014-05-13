app





.run(function($rootScope, facebookAuthService, $location, authService) {

    authService.setIsLogging(true);

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
        //$rootScope.isLogging = authService.data.isLogging;
        facebookAuthService.watchAuthStatusChange();

    };


    $rootScope.$on('$routeChangeSuccess', function(scope, currentRoute, prevRoute) {

        (function() {
            SpriteSpinner = function(el, options) {
                var self = this,
                    img = el.children[0];
                this.interval = options.interval || 10;
                this.diameter = options.diameter || img.width;
                this.count = 0;
                this.el = el;
                img.setAttribute("style", "position:absolute");
                el.style.width = this.diameter + "px";
                el.style.height = this.diameter + "px";
                return this;
            };
            SpriteSpinner.prototype.start = function() {
                var self = this,
                    count = 0,
                    img = this.el.children[0];
                this.el.display = "block";
                self.loop = setInterval(function() {
                    if (count == 19) {
                        count = 0;
                    }
                    img.style.top = (-self.diameter * count) + "px";
                    count++;
                }, this.interval);
            };
            SpriteSpinner.prototype.stop = function() {
                clearInterval(this.loop);
                this.el.style.display = "none";
            };
            document.SpriteSpinner = SpriteSpinner;
        })();

        $(document).ready(function() {
            $(".sprite-spinner").each(function(i) {
                var s = new SpriteSpinner(this, {
                    interval: 50
                });
                s.start();
            });
        });

        function isRestrictedView(currentRoute) {

            if (typeof currentRoute.access === "undefined" || typeof currentRoute.access.isFree === "undefined") {
                console.warn('There\'s a route without restriction policies. Restricted as default.');
                return true;

            } else if (currentRoute.access.isFree) {
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