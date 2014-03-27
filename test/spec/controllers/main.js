'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('angulApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});


describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('angulApp'));

  var LoginCtrl,
    scope,
    routeParams;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    
    routeParams = {
      socialNetwork : 'Google'
    };

    LoginCtrl = $controller('MainCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });
  }));

  it('should have the social network we use to login', function () {
    expect(routeParams.socialNetwork).equals('Google');
  });
});
