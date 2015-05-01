'use strict';

describe('Service: agsFactory', function () {

  // load the service's module
  beforeEach(module('hydrantsDashboardApp'));

  // instantiate service
  var agsFactory;
  beforeEach(inject(function (_agsFactory_) {
    agsFactory = _agsFactory_;
  }));

  it('should do something', function () {
    expect(!!agsFactory).toBe(true);
  });

});
