'use strict';

describe('Directive: totalsTable', function () {

  // load the directive's module
  beforeEach(module('hydrantsDashboardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<totals-table></totals-table>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the totalsTable directive');
  }));
});
