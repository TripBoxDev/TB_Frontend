'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('angulApp'));

  var LoginCtrl,
    scope,
    authService;
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    authService = {
      data: {
        isLogged : false,
        username : ''
      },
      login : function() {
        authService.data.isLogged = true;
      }
    };
     

    

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      authService: authService
    });
  }));


  it('should mark as not logged in when we haven\'t done a login', function() {
    expect(authService.data.isLogged).toBeFalsy();
  });


  it('should mark as logged in when connection with Facebook is successful', function() {

    scope.loginFacebook();

    expect(authService.data.isLogged).toBeTruthy();

  });



});