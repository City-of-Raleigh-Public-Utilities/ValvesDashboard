'use strict';

/**
 * @ngdoc service
 * @name hydrantsDashboard.repots
 * @description
 * # repots
 * Factory in the hydrantsDashboard.
 */
angular.module('hydrantsDashboard')
  .factory('repots', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
