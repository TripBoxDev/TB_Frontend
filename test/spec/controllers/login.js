'use strict';

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

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });
  }));

  it('should have the social network we use to login', function () {
    expect(scope.socialNetwork).toEqual('Google');
  });
});