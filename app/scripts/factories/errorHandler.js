app.factory('ErrorHandler', function($location) {
    return {
        redirectError : function () {
            $location.path('/error');
        }
    }
})
