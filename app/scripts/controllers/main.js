app.run(function($rootScope, facebookAuthService, $location, authService, $log) {


    $log.info('Carga sprite spinner plugin');
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





/*
    $rootScope.$on('$routeChangeSuccess', function(scope, currentRoute, prevRoute) {


        function isRestrictedView(currentRoute) {

            if (typeof currentRoute.access === "undefined" || typeof currentRoute.access.isFree === "undefined") {
                console.warn('There\'s a route without restriction policies. Restricted as default.');
                return true;

            } else if (currentRoute.access.isFree) {
                return false;
            } else if (!currentRoute.access.isFree) {
                return true;
            }

        }
        // Conditions to see a restricted view
        if (isRestrictedView(currentRoute) && !authService.data.isLogged) {
            $log.info('Islogged:' + authService.data.isLogged);
            if (currentRoute.templateUrl !== 'views/main.html') {
                $log.warn('now redirect url will be: ' + $location.path());
                if($location.path() !== "" && $location.path() !== "/#/" ) authService.setRedirectUrl($location.path());
                $location.path('/');
                console.log('Should be logged in, redirecting to /');
            }
        }
    });
*/
});