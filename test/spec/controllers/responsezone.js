'use strict';

describe('Controller: ResponsezoneCtrl', function () {

  // load the controller's module
  beforeEach(module('hydrantsDashboardApp'));

  var ResponsezoneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResponsezoneCtrl = $controller('ResponsezoneCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
