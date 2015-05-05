'use strict';

describe('Controller: ValvesCtrl', function () {

  // load the controller's module
  beforeEach(module('hydrantsDashboard'));

  var ValvesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ValvesCtrl = $controller('ValvesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
