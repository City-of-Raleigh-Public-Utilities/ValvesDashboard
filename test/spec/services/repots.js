'use strict';

describe('Service: repots', function () {

  // load the service's module
  beforeEach(module('hydrantsDashboard'));

  // instantiate service
  var repots;
  beforeEach(inject(function (_repots_) {
    repots = _repots_;
  }));

  it('should do something', function () {
    expect(!!repots).toBe(true);
  });

});
