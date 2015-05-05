'use strict';

/**
 * @ngdoc service
 * @name hydrantsDashboardApp.hydrantStats
 * @description
 * # hydrantStats
 * Factory in the hydrantsDashboardApp.
 */

 //  # of valves inspected
 // # of valves inoperable
 // # of valves need repair
 // # of valves contractor cutoff = true
 // # of valves permalogger = true
 //
 // Then the spreadsheet attached should have all attributes of all valves that are inoperable, need repair, contractor cutoff = true or permalogger = true

angular.module('valvesDashboard')
  .factory('valveStats', ['$filter', 'agsFactory', '$localStorage', '$q', function ($filter, agsFactory, $localStorage, $q) {

    //Private
    var token = $localStorage.token;

    var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setMilliseconds(0);

    var startDate = new Date(2015, 4, 1, 0, 0, 0);
    var layers = ['System Valves', 'Control Valves'];
    var report = {
      inspected: {
        count: 0,
        name: '# of Valves Inspected',
        where: 'INSPECTDATE IN NOT NULL'
      },
      inoperable: {
        count: 0,
        name: '# of Valves Inoperable',
        where: 'OPERABLE = "T"'
      },
      needRepair: {
        count: 0,
        name: '# of Valves Need Repair',
        where: 'REPAIRNEED = 1'
      },
      contractor: {
        count: 0,
        name: '# of Valves Contractor Cutoff',
        where: 'CONTRACTOR_CUT_OFF = 1'
      },
      permalogger: {
        count: 0,
        name: '# of Valves Permalogger',
        where: 'PERMALOGGER = 1'
      }
    };

    var Stats = {


      getCheckedStats: function (geom){
        var promiseList = [];

        layers.forEach(function(layer){

          for (var i in report){
            var options = {
              layer: layer,
              geojson: false,
              actions: 'query',
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              params: {
                token: token,
                f: 'json',
                where: report[i].where,
                returnGeometry: false,
                returnCountOnly: true
              }
            };

            promiseList.push(agsFactory.publicUtilFS.request(options));

          }

        });




          //return promise
          return $q.all(promiseList);

        // });

      }



    };

    return (Stats);

  }]);


  // newTotPriv = GetFeatureCount(sde, selectarea, "RFDSTATION IS NOT NULL AND CREATEDON >= TO_DATE(" + NewDate + ") AND OWNEDBY = 1")
  // print "New (Private): "+str(newTotPriv)
