'use strict';

/**
 * @ngdoc function
 * @name hydrantsDashboardApp.controller:ResponsezoneCtrl
 * @description
 * # ResponsezoneCtrl
 * Controller of the hydrantsDashboardApp
 */
angular.module('hydrantsDashboard')
  .controller('ResponsezoneCtrl', ['$scope', '$route', '$routeParams', '$location', 'FIREDEPTS', 'agsFactory', 'leafletData', '$filter', '$interval', 'hydrantStats', 'hydrantEvents', '$timeout', '$localStorage', 'icons', '$rootScope',
    function ($scope, $route, $routeParams, $location, FIREDEPTS, agsFactory, leafletData, $filter, $interval, hydrantStats, hydrantEvents, $timeout, $localStorage, icons, $rootScope) {


    //Get Route Details
    //  $scope.$route = $route;
    //  $scope.$location = $location;
     $scope.$routeParams = $routeParams;

     agsFactory.isTokenValid($localStorage.expires);

     $scope.token = $localStorage.token;

     $scope.responseZone = $routeParams.zone;


     FIREDEPTS.forEach(function(dept){
       if (dept.title === $scope.responseZone){
         $scope.badge = dept.icon;
       }
     });

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

    //Marker cluster parent group
    $rootScope.markers = new L.MarkerClusterGroup();

    $rootScope.markers.on('mouseover', function (a) {
      var f = a.layer.feature.properties,
          checked = f.CHECKED === 'Y' ? 'Yes' : 'No',
          repair = f.REPAIRNEED ? 'No' : 'Yes',
          operable = f.OPERABLE === 'Y' ? 'Yes' : 'No';
        var marker = a.target;
        a.layer.bindPopup("<b>Facility ID: " + f.FACILITYID + "</b><br>Checked: "+ checked + "</b><br>Needs Repair: " + repair + "</b><br>Operable: " + operable).openPopup();
        $scope.selectedHydrant = a.layer.feature;
        return a.layer.feature;
    });

     //Feature group to store map bounds
     var mapBounds =  new L.FeatureGroup();

     var repairSelections = new L.FeatureGroup();

     //Placeholder for hydrant selection
     $scope.selectedHydrant = {};

     //Hydrants reference used in search
     $scope.hydrantRef = {};

     //Map filters
     $scope.mapFilterOptions = hydrantEvents.filters;
     $scope.mapFilterSelection = hydrantEvents.filters[0];

     $scope.updateFilter = function(){
       //Set timeout to return promise to trigger loading
       $scope.filterPromise = $timeout(function(){
         angular.extend($scope, {
           geojson: {
               data: $scope.geojson.data,
              //  pointToLayer: $scope.mapFilterSelection.setIcons,
               resetStyleOnMouseout: true
           },
           legend: $scope.mapFilterSelection.legend
       });

       $rootScope.markers.clearLayers();
       hydrantEvents.resetOptions($scope.mapFilterSelection.graphOptions);
       
       $rootScope.markers.addLayer(L.geoJson($scope.geojson.data, {pointToLayer: $scope.mapFilterSelection.setIcons}));


       $scope.mapFilterSelection.getData().then(function(res){
         console.log(res);
         $scope.data = res;
       });
     }, 1000);
   };



     //Set current date
     $interval(function(){
       $scope.today = $filter('date')(new Date(), 'short');
     }, 1000);

     //Set options for query
     var options = {
       serviceArea: {
        layer: 'RPUD.CombinedFireResponse',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        geojson: true,
        actions: 'query',
        params: {
          token: $scope.token,
          f: 'json',
          text: $scope.responseZone,
          outSR: 4326
        }
      },
      hydrants: {
        layer: 'RPUD.wHydrant',
        geojson: true,
        actions: 'query',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        timeout: 25000,
        params: {
          token: $scope.token,
          f: 'json',
          geometryType: 'esriGeometryPolygon',
          outFields: 'STNUM, ISSUE1, ISSUE2, SERVICEDBY, FLOWDATE, STENUM, STPREFIX, STNAME, STTYPE, STSUFFIX, OWNEDBY, MANUFACTURER, HYDRANTYEAR, VALVESIZE, PUMPERNOZZLETYPE, SIDENOZZLETYPE, OPERABLE, REPAIRNEED, NOTES, RFD_NOTES, FACILITYID, CHECKED, JURISID, RFDSTATION, EDITEDON, CREATEDON',
          inSR: 4326,
          outSR: 4326,
          spatialRel: 'esriSpatialRelContains'
        }
      }
    };

    //Map Events
    leafletData.getMap().then(function(map) {
      map.addLayer($rootScope.markers);

      $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
        $scope.selectedHydrant = hydrantEvents.hydrantMouseover(feature, leafletEvent);
      });

      $scope.$on('leafletDirectiveMap.geojsonClick', function(ev, featureSelected, leafletEvent) {
          hydrantEvents.zoomToFeature(featureSelected);
      });

      //Controls hover events on needs repairs table
      $scope.zoomToFeature = function(feature){
        //Clear last features
        repairSelections.clearLayers();

        if ($scope.selectedHydrant.properties){
          $scope.selectedHydrant.properties = feature.attributes;
        }
        else{
          $scope.selectedHydrant = {};
          $scope.selectedHydrant.properties = feature.attributes;
        }

        map.setView([feature.geom.coordinates[1], feature.geom.coordinates[0]], 18);

        //Sets the highlight for selected repair feature
        var layer  = L.circleMarker([feature.geom.coordinates[1], feature.geom.coordinates[0]]);
        layer.setStyle({
          radius: 16,
          fillColor: '#00ffe6',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
        repairSelections.addLayer(layer);
        repairSelections.addTo(map);
        repairSelections.bringToBack();
      };

      //Clear the last selected feature for the repairs list when user leaves the table
      $scope.clearFeature = function(){
        //Clear last features
        repairSelections.clearLayers();
      }


      //Controls search bar above map
      $scope.searchMap = function(event, textFilter, geojson){
        //Set timeout to return promise
        $scope.searchPromise = $timeout(function(){
          //Filter geometry base on search text
          geojson.data.features = $filter('filter')($scope.hydrantRef.features, {$:textFilter});
          //Add new geojson scope
          angular.extend($scope, {
            geojson: {
                data: geojson.data,
                // pointToLayer: $scope.mapFilterSelection.setIcons,
                // style: hydrantEvents.setHydrantStyle,
                resetStyleOnMouseout: true
            }
          });
          $rootScope.markers.clearLayers();
          $rootScope.markers.addLayer(L.geoJson($scope.geojson.data, {pointToLayer: $scope.mapFilterSelection.setIcons}));

          //Clear current layers from feature group
          mapBounds.clearLayers();
          var enveloped = turf.envelope(geojson.data);
          L.geoJson(enveloped,{
            onEachFeature: function (feature, layer){
              mapBounds.addLayer(layer);
            }
          });

          //Zoom to searched region
          map.fitBounds(mapBounds.getBounds());


        }, 500);

      };


      $scope.chartlabels = [''] //['Public', 'Private']; //['Download Sales', 'In-Store Sales', 'Mail Sales'];
      $scope.colours = hydrantEvents.graphOptions.colours; //["#F7464A", "#5AD3D1", "#FFC870", "#8f04f8"];
      $scope.series = hydrantEvents.graphOptions.chartlabels;
      $scope.data = [
        [0],
        [0],
        [0],
        [0]
        ];
  // $scope.data = hydrantEvents.graphOptions.data;//[300, 500, 100, 455];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

//Add chart to map
    var chartController = L.Control.extend({
      options: {
        position: 'topright'
      },

      onAdd: function (map) {
          var container = L.DomUtil.get('line');
          return container;
      }
  });

  map.addControl(new chartController());


     });


      $scope.serviceAreas;

      agsFactory.publicUtilMS.request(options.serviceArea)
      // agsFactory.publicSafteyMS.request(options.serviceArea)
        .then(function(res){


          $scope.serviceAreas = turf.combine(res);
          // console.log($scope.serviceAreas);
          // var enveloped = turf.envelope($scope.serviceAreas);
          // var districts = Terraformer.ArcGIS.convert(enveloped.geometry);


          var simplified = turf.simplify(res.features[0], 0.02, true);

          var districts = Terraformer.ArcGIS.convert(simplified.geometry);



          //Empties exisiting feature group
          mapBounds.clearLayers();


        leafletData.getMap().then(function(map) {
          //Sets geojson object and adds each layer to featureGroup as a layer, so it can be edited
          L.geoJson($scope.serviceAreas, {
            style: {
                fillColor: 'rgba(50, 173, 2, 0.74)',
                weight: 2,
                opacity: 1,
                color: '#fff',
                dashArray: '3',
                fillOpacity: 0.7
            },
            onEachFeature: function (feature, layer) {
              mapBounds.addLayer(layer);
            }
          }).addTo(map);
          //Get bounds from geojson and fits to map
          map.fitBounds(mapBounds.getBounds());

          //Adding zoom control needs to happen here so that it adopts the init map bounds for the home button
          var zoomHome = L.Control.zoomHome();
              zoomHome.addTo(map);
      });

          return districts;
        }, function(err){
          console.log('Error: Cannot retrieve response zones');
        })
        .then(function(districts){

          //Set bounds for query
          options.hydrants.params.geometry = districts;

          // Make request to hydrants
          // agsFactory.publicUtilFS.request(options.hydrants)

          //start
          // hydrantStats.getCheckedStats(districts).then(function(res){
          //   console.log(res);
          // });

          $scope.hydrantPromise = agsFactory.publicUtilFS.request(options.hydrants);

          $scope.hydrantPromise.then(function(res){
              console.log(res);
              try{
                if (typeof res !== 'object') throw {error: 'Please login'};
              }
              catch (err){
                console.log(err);
                return;
              }
              // hydrantStats.addDomains(res.features, function(features){
              //   res.features = features
              // });
              angular.copy(res, $scope.hydrantRef);

          //Add hydrants to map
              angular.extend($scope, {
                geojson: {
                    data: res,
                    style: $scope.mapFilterSelection.style,
                    resetStyleOnMouseout: true
                },
                legend: $scope.mapFilterSelection.legend
            });

            $rootScope.markers.addLayer(L.geoJson($scope.geojson.data, {pointToLayer: hydrantEvents.setIcons}));


            //Generate map reports
            hydrantStats.getReport(res.features, function(report){
              $scope.reportTotals = report;
              $scope.needsRepair = [
                {
                  status: true,
                  data: report.needsRepairPublic,
                  name: 'Needs Repair Public'
                },
                {
                  status: false,
                  data: report.needsRepairPrivate,
                  name: 'Needs Repair Private'
                }
              ];
              $scope.selected = $scope.needsRepair[0];
              if ($scope.needsRepair[0].data[0]){
                $scope.headers = Object.keys($scope.needsRepair[0].data[0].attributes);
              }


              //Add chart control


              hydrantEvents.getData().then(function(res){
                console.log(res);
                $scope.data = res;
              });

              //Prepares data to print
              $scope.printCSV = function(data){
                var csv = [];
                data.forEach(function(feature){
                  csv.push(feature.attributes);
                });
                return csv;
              };

            });


            }, function(err){
              console.log('Error: Cannot retrieve hydrants');
            });

        }, function(err){
          console.log('Error: Cannot retrieve districts');
        });

        $scope.$watch('reportTotals', function(){});
        $scope.$watch('needsRepair', function(){});


  }]);
