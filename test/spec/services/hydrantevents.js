'use strict';

describe('Service: hydrantEvents', function () {

  // load the service's module
  beforeEach(module('hydrantsDashboardApp'));

  // instantiate service
  var hydrantEvents;
  beforeEach(inject(function (_hydrantEvents_) {
    hydrantEvents = _hydrantEvents_;
  }));

  it('should do something', function () {
    expect(!!hydrantEvents).toBe(true);
  });

});
