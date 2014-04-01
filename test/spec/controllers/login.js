'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('angulApp'));

  var LoginCtrl,
    scope,
    routeParams,
    authService,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    routeParams = {
      socialNetwork : 'Google'
    };
    authService = {
      data: {
        isLogged : false,
        username : ''
      }
    };
     

    httpBackend = $httpBackend;
    

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      $routeParams: routeParams,
      authService: authService
    });
  }));

  it('should have the social network we used to login', function () {
    expect(scope.socialNetwork).toEqual('Google');
  });

  it('should mark as not logged in when we haven\'t done a login', function() {
    expect(authService.data.isLogged).toBeFalsy();
  });


  it('should mark as logged in when connection is successful', function() {
    // Define how will be the query from the controller and what is answered from server
    httpBackend.when('GET', '/').respond({userId: 'userX'}, {'A-Token': 'xxx'});

    // Set httpBackend to listen for GET queries to defined route, so it'd be mocked.
    httpBackend.expectGET('/');
    
    scope.login();

    httpBackend.flush();
    expect(authService.data.isLogged).toBeTruthy();

  });



});