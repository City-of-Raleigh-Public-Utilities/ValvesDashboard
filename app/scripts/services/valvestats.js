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
  .factory('valveStats', ['$filter', 'agsFactory', '$localStorage', function ($filter, agsFactory, $localStorage) {

    //Private
    var token = $localStorage.token;

    var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setMilliseconds(0);

    var startDate = new Date(2015, 4, 1, 0, 0, 0);
    var cleanReport = {
      daily: {
        Checked: 0,
        Inoperable: 0,
        Need_Repair: 0,
        New_Hydrants: 0
      },
      total: {
        Checked_Public: 0,
        Checked_Private: 0,
        Inoperable_Public: 0,
        Inoperable_Private: 0,
        Need_Repair_Public: 0,
        Need_Repair_Private: 0,
        New_Hydrant_Public: 0,
        New_Hydrant_Private: 0
      },
      needsRepairPublic: [],
      needsRepairPrivate: []
    };

    var Stats = {

      report: {
        daily: {
          Checked: 0,
          Inoperable: 0,
          Need_Repair: 0,
          New_Hydrants: 0
        },
        total: {
          Checked_Public: 0,
          Checked_Private: 0,
          Inoperable_Public: 0,
          Inoperable_Private: 0,
          Need_Repair_Public: 0,
          Need_Repair_Private: 0,
          New_Hydrant_Public: 0,
          New_Hydrant_Private: 0
        },
        needsRepairPublic: [],
        needsRepairPrivate: []
      },

      getReport: function (features, callback){
        var that = this;
        //reset stats

        this.report = angular.copy(cleanReport);
        features.forEach(function(feature){

          var prop = feature.properties;
          if (feature.properties.EDITEDON > today.getTime()){
            prop.CHECKED === 'Y' ? that.report.daily.Checked++ : 0;
            prop.OPERABLE === 'N' ? that.report.daily.Inoperable++ : 0;
            prop.REPAIRNEED === '1' ? that.report.daily.Need_Repair++ : 0;
            prop.CREATEDON >= today.getTime() ? that.report.daily.New_Hydrants++ : 0;
          }

          //Total Checked
          prop.CHECKED === 'Y' && prop.OWNEDBY === 0 && prop.RFDSTATION !== null ? that.report.total.Checked_Public++ : 0;
          prop.CHECKED === 'Y' && prop.OWNEDBY === 1 && prop.RFDSTATION !== null ? that.report.total.Checked_Private++ : 0;

          //Total Inoperable
          prop.OPERABLE === 'N' && prop.OWNEDBY === 0 && prop.RFDSTATION !== null ? that.report.total.Inoperable_Public++ : 0;
          prop.OPERABLE === 'N' && prop.OWNEDBY === 1 && prop.RFDSTATION !== null ? that.report.total.Inoperable_Private++ : 0;

          //Total Needs Repair
          prop.REPAIRNEED === 1 && prop.OWNEDBY === 0 && prop.RFDSTATION !== null ? (that.report.total.Need_Repair_Public++, that.report.needsRepairPublic.push({attributes: prop, geom: feature.geometry})) : 0;
          prop.REPAIRNEED === 1 && prop.OWNEDBY === 1 && prop.RFDSTATION !== null ? (that.report.total.Need_Repair_Private++, that.report.needsRepairPrivate.push({attributes: prop, geom: feature.geometry}))  : 0;

          //Total New Hydrants
          prop.CREATEDON >= startDate.getTime() && prop.OWNEDBY === 0 && prop.RFDSTATION !== null ? that.report.total.New_Hydrant_Public++ : 0;
          prop.CREATEDON >= startDate.getTime() && prop.OWNEDBY === 1 && prop.RFDSTATION !== null ? that.report.total.New_Hydrant_Private++ : 0;

        });

        // this.report.features = this.addDomains(features);


        callback(this.report);
      },

      getCheckedStats: function (geom){
        var dirty = (new Date()).getTime();
        var sql = ['RFDSTATION IS NOT NULL AND CHECKED = "Y" AND OWNEDBY = 1', 'RFDSTATION IS NOT NULL AND CHECKED = "Y" AND OWNEDBY <> 1' ];
        var options = {
          layer: 'Fire Hydrants',
          geojson: false,
          actions: 'query',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          params: {
            token: token,
            f: 'json',
            where: "RFDSTATION IS NOT NULL AND CHECKED = 'Y' AND " + dirty + " = " + dirty,
            returnGeometry: false,
            geometryType: 'esriGeometryPolygon',
            spatialRel: 'esriSpatialRelContains',
            geometry: geom,
            outStatistics: [
              {
                "statisticType": "count",
                "onStatisticField": "CHECKED",
                "outStatisticFieldName": "count"
              }
            ],
            groupByFieldsForStatistics: 'OWNEDBY'
          }
        };

        // sql.forEach(function(query){

          //Set where parameter
          // options.params.where = query;

          //return promise
          return agsFactory.publicUtilFS.request(options);

        // });

      }



    };

    return (Stats);

  }]);

  // print "Counting Features..."
  // inopTotPub = GetFeatureCount(sde, selectarea,"RFDSTATION IS NOT NULL AND OPERABLE = 'N' AND OWNEDBY <> 1")
  // print "Inoperable (Public): "+str(inopTotPub)
  // inopTotPriv = GetFeatureCount(sde, selectarea,"RFDSTATION IS NOT NULL AND OPERABLE = 'N' AND OWNEDBY = 1")
  // print "Inoperable (Private): "+str(inopTotPriv)
  // repTotPub = GetFeatureCount(sde, selectarea,"RFDSTATION IS NOT NULL AND REPAIRNEED = 1 AND OWNEDBY <> 1")
  // print "Need Repair (Public): "+str(repTotPub)
  // repTotPriv = GetFeatureCount(sde, selectarea,"RFDSTATION IS NOT NULL AND REPAIRNEED = 1 AND OWNEDBY = 1")
  // print "Need Repair (Private): "+str(repTotPriv)
  // chkTotPub = GetFeatureCount(sde, selectarea, "RFDSTATION IS NOT NULL AND CHECKED IN ('Y','GPS','NEW') AND OWNEDBY <> 1")
  // print "Checked (Public): "+str(chkTotPub)
  // chkTotPriv= GetFeatureCount(sde, selectarea, "RFDSTATION IS NOT NULL AND CHECKED IN ('Y','GPS','NEW') AND OWNEDBY = 1")
  // print "Checked (Private): "+str(chkTotPriv)
  // newTotPub = GetFeatureCount(sde, selectarea, "RFDSTATION IS NOT NULL AND CREATEDON >= TO_DATE(" + NewDate + ") AND OWNEDBY <> 1")
  // print "New (Public): "+str(newTotPub)
  // newTotPriv = GetFeatureCount(sde, selectarea, "RFDSTATION IS NOT NULL AND CREATEDON >= TO_DATE(" + NewDate + ") AND OWNEDBY = 1")
  // print "New (Private): "+str(newTotPriv)
