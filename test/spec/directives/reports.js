'use strict';

describe('Directive: reports', function () {

  // load the directive's module
  beforeEach(module('valvesDashboard'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<repots></repots>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the repots directive');
  }));
});
