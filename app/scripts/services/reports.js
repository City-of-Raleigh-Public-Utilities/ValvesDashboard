'use strict';

/**
 * @ngdoc service
 * @name hydrantsDashboard.repots
 * @description
 * # repots
 * Factory in the hydrantsDashboard.
 */
angular.module('valvesDashboard')
  .factory('reports', ['agsFactory', '$localStorage', function (agsFactory, $localStorage) {

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
            f: 'json',
            where: '1=1',
            outSR: 4326,
            outFields: '*'
          }
        };

        return agsFactory.publicUtilFS.request(options);

      },
      setColumnDef: function (fields){
        var columnDef = [];
        fields.forEach(function(f){
          columnDef.push({field: f.name, displayName: f.alias, width: f.length })
        });
        return columnDef;
      }
    };
  }]);
