'use strict';

/**
 * @ngdoc function
 * @name hydrantsDashboard.controller:ValvesCtrl
 * @description
 * # ValvesCtrl
 * Controller of the hydrantsDashboard
 */
angular.module('valvesDashboard')
  .controller('ValvesCtrl', ['$scope', '$route', '$routeParams', '$location', 'agsFactory', 'leafletData', '$filter', '$interval', 'valveStats', 'valveEvents', '$timeout', '$localStorage', 'icons', '$rootScope',
    function ($scope, $route, $routeParams, $location, agsFactory, leafletData, $filter, $interval, valveStats, valveEvents, $timeout, $localStorage, icons, $rootScope) {
    //Get Route Details
    //  $scope.$route = $route;
    //  $scope.$location = $location;
     $scope.$routeParams = $routeParams;

     agsFactory.isTokenValid($localStorage.expires);

     $scope.token = $localStorage.token;

     $scope.responseZone = $routeParams.zone;

     $scope.badge = '';
     //Base map setup
     angular.extend($scope, {
       defaults: {
           zoomControl: false,
           tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
       },

       layers: {
         baselayers: {
           osm: {
             name: 'OpenStreetMap',
             url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
             type: 'xyz',
             layerParams: {},
             layerOptions: {}
           },
         },
           overlays: {
             Hydrants: {
               name: 'Hydrants',
               type: 'dynamic',
               url: 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/HydrantInspection/MapServer',
               visible: true,
              layerParams: {
                token: $scope.token
              },
               layerOptions: {
                 layers: [1],
                 opacity: 0.5,
                 attribution: 'Copyright:© 2015 City of Raleigh',
                position: 'back'
               }
             },
           }
        },
    });

    valveStats.getCheckedStats().then(function(params){
      console.log(params);

    },
    function(err){
      console.log(err);
    })
  }]);
