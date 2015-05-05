'use strict';

/**
 * @ngdoc service
 * @name hydrantsDashboardApp.agsFactory
 * @description
 * # agsFactory
 * Factory in the hydrantsDashboardApp.
 */
angular.module('valvesDashboard')
  .factory('agsFactory', ['Ags', '$http', '$q', '$localStorage', '$location', function (Ags, $http, $q, $localStorage, $location) {

    // Add Server Urls
    var mapsServer = new Ags({'host': 'maps.raleighnc.gov', protocol: 'https'}),
        testServer = new Ags({'host': 'mapstest.raleighnc.gov', protocol: 'http'}),



        // baseUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/FireHydrants/FeatureServer';
        // function getHydrants (options) {
        //    var deferred = $q.defer();
        //   $http({
        //     method: 'GET',
        //     url: baseUrl+'/0/query',
        //     params: options,
        //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        //   }).success(function (data) {
        //     deferred.resolve(data);
        //   });
        //   return deferred.promise;
        // };





      services = {

          login: function (user, password) {
            return testServer.requestToken(user, password, 60);
          },

          isTokenValid: function (exp){
            var today = new Date();
            if (today < exp){
              return true;
            }
            else {
              $location.path('/valves');
              return false;
            }

          },

          // //Contain Response Districts
          // publicUtilMS: testServer.setService({
          //   folder: 'PublicUtility',
          //   service: 'FireHydrants',
          //   server: 'MapServer',
          // }),
          //
          // //Contains Hydrant data
          // publicUtilFS: testServer.setService({
          //   folder: 'PublicUtility',
          //   service: 'FireHydrants',
          //   server: 'FeatureServer',
          // }),

          //Contain Response Districts
          publicUtilMS: testServer.setService({
            folder: 'PublicUtility',
            service: 'ValvesDataCollection',
            server: 'MapServer',
          }),

          //Contains Hydrant data
          publicUtilFS: testServer.setService({
            folder: 'PublicUtility',
            service: 'ValvesDataCollection',
            server: 'FeatureServer',
          }),
          //Add mapstest for geometry services
          // mapstest: mapstest,

          // getHydrants: getHydrants,


        };

        return (services);
  }]);
