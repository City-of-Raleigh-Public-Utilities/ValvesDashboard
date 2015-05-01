'use strict';

describe('Service: hydrantStats', function () {

  // load the service's module
  beforeEach(module('hydrantsDashboardApp'));

  // instantiate service
  var hydrantStats;
  beforeEach(inject(function (_hydrantStats_) {
    hydrantStats = _hydrantStats_;
  }));

  it('should do something', function () {
    expect(!!hydrantStats).toBe(true);
  });

});
