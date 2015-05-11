'use strict';

/**
 * @ngdoc service
 * @name hydrantsDashboard.repots
 * @description
 * # repots
 * Factory in the hydrantsDashboard.
 */
angular.module('valvesDashboard')
  .factory('repots', ['agsFactory', '$localStorage', function (agsFactory, $localStorage) {

    var token = $localStorage.token;

    // Public API here
    return {
      getReport: function (layer) {
        var options = {
          layer: layer,
          geojson: false,
          actions: 'query',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          params: {
            token: token,
            f: 'json'
          }
        };

        return agsFactory.publicUtilFS(options);

      }
    };
  }]);
