'use strict';

describe('Service: reports', function () {

  // load the service's module
  beforeEach(module('reportsDashboard'));

  // instantiate service
  var reports;
  beforeEach(inject(function (_reports_) {
    reports = _reports_;
  }));

  it('should do something', function () {
    expect(!!reports).toBe(true);
  });

});
