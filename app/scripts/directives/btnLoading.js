app.directive("btnLoading", function() {
    return function(scope, element, attrs) {
        scope.$watch(function() {
            return scope.$eval(attrs.ngDisabled);
        }, function(newVal) {
            //you can make the following line more robust
            if (newVal) {
                return;
            } else {
                return scope.$watch(function() {
                        return scope.$eval(attrs.btnLoading);
                    },

                    function(loading) {
                        if (loading) return element.button("loading");
                        element.button("reset");
                    });
            }
        });
    };
});