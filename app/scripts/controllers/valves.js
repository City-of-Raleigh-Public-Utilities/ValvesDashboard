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

    var valid = agsFactory.isTokenValid($localStorage.expires);


     $scope.token = $localStorage.token;

     $scope.responseZone = $routeParams.zone;

     $scope.badge = './images/butterfly.jpg';
     //Base map setup
     angular.extend($scope, {
       raleigh: {
         lat: 35.779385463030465,
         lng:-78.63876342773438,
         zoom: 11
       },
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
             permalogger: {
               name: 'Permalogger',
               type: 'dynamic',
               url: 'http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/ValvesDataCollection/MapServer',
               visible: false,
              layerParams: {
                token: $scope.token
              },
               layerOptions: {
                 layers: [1],
                 opacity: 1,
                 attribution: 'Copyright:© 2015 City of Raleigh',
                position: 'back'
               }
             },
             permalogger: {
               name: 'Contractor Cut Off',
               type: 'dynamic',
               url: 'http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/ValvesDataCollection/MapServer',
               visible: false,
              layerParams: {
                token: $scope.token
              },
               layerOptions: {
                 layers: [0],
                 opacity: 1,
                 attribution: 'Copyright:© 2015 City of Raleigh',
                position: 'back'
               }
             },
             rpsv: {
               name: 'Repair Needed - System Valves',
               type: 'dynamic',
               url: 'http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/ValvesDataCollection/MapServer',
               visible: false,
              layerParams: {
                token: $scope.token
              },
               layerOptions: {
                 layers: [2],
                 opacity: 1,
                 attribution: 'Copyright:© 2015 City of Raleigh',
                position: 'back'
               }
             },
             rpcv: {
               name: 'Repair Needed - Control Valves',
               type: 'dynamic',
               url: 'http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/ValvesDataCollection/MapServer',
               visible: false,
              layerParams: {
                token: $scope.token
              },
               layerOptions: {
                 layers: [3],
                 opacity: 1,
                 attribution: 'Copyright:© 2015 City of Raleigh',
                position: 'back'
               }
             },
             systemvalves: {
               name: 'System Valves',
               type: 'dynamic',
               url: 'http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/ValvesDataCollection/MapServer',
               visible: true,
              layerParams: {
                token: $scope.token
              },
               layerOptions: {
                 layers: [5],
                 opacity: 1,
                 attribution: 'Copyright:© 2015 City of Raleigh',
                position: 'back'
               }
             },
             controlvalves: {
               name: 'Control Valves',
               type: 'dynamic',
               url: 'http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/ValvesDataCollection/MapServer',
               visible: true,
              layerParams: {
                token: $scope.token
              },
               layerOptions: {
                 layers: [4],
                 opacity: 1,
                 attribution: 'Copyright:© 2015 City of Raleigh',
                position: 'back'
               }
             },
             pressureZone: {
               name: 'Pressure Zones',
               type: 'dynamic',
               url: 'http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/ValvesDataCollection/MapServer',
               visible: true,
              layerParams: {
                token: $scope.token
              },
               layerOptions: {
                 layers: [6],
                 opacity: 0.5,
                 attribution: 'Copyright:© 2015 City of Raleigh',
                position: 'back'
               }
             },
             grid: {
               name: 'Grid',
               type: 'dynamic',
               url: 'http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/ValvesDataCollection/MapServer',
               visible: true,
              layerParams: {
                token: $scope.token
              },
               layerOptions: {
                 layers: [7],
                 opacity: 0.5,
                 attribution: 'Copyright:© 2015 City of Raleigh',
                position: 'back'
               }
             },
           }
        },
    });

$scope.report = valveStats.report;
if(valid){
  var types = ['inspected', 'inoperable', 'needRepair', 'contractor', 'permalogger'];
      types = types.concat(types);
    valveStats.getCheckedStats().then(function(params){
      for (var i = 0, l = params.length; i < l; i++){
        if(params[i].error){}
        else{
          $scope.report[types[i]].count+= params[i].count;
        }
      }
      console.log($scope.report);

    },
    function(err){
      console.log(err);
    });

}

}]);
