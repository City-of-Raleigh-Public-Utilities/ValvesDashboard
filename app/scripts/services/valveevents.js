'use strict';

/**
 * @ngdoc service
 * @name hydrantsDashboardApp.hydrantEvents
 * @description
 * # hydrantEvents
 * Factory in the hydrantsDashboardApp.
 */





angular.module('valvesDashboard')
  .factory('valveEvents', ['leafletData', 'icons', '$q', '$timeout', function (leafletData, icons, $q, $timeout) {

    //Constant Colors
    var blue = '#0b3af8',
        red = '#f40707',
        yellow = '#eefd0f',
        orange = '#fda409';


    var MapEvents = {

      resetOptions: function(options){
        angular.extend(options, {
          yPublic: 0,
          nPublic: 0,
          yPrivate: 0,
          nPrivate: 0
        });
      },
      graphOptions: {
        yPublic: 0,
        nPublic: 0,
        yPrivate: 0,
        nPrivate: 0,
        chartlabels: ['Checked (Public)', 'Checked (Prvate)', 'Not Checked (Public)', 'Not Checked (Private)'],
        // data: [MapEvents.graphOptions.yPublic, MapEvents.graphOptions.yPrivate, MapEvents.graphOptions.nPublic, MapEvents.graphOptions.nPrivate],
        colours: [orange, yellow, red, blue]
      },
      getData: function(){
        var that = this;
        console.log(that);
        var deferred = $q.defer();
        $timeout(function(){
          var d = that.graphOptions;
          deferred.resolve([
            [d.yPublic],
            [d.yPrivate],
            [d.nPublic],
            [d.nPrivate]
          ]);
        }, 500);
        return deferred.promise;
      },


      setIcons: function (feature, latlng) {

        var f = feature.properties;
        //Public
        if(f.OWNEDBY === 0){
          if(f.CHECKED === 'N' && f.RFDSTATION !== null){
            MapEvents.graphOptions.nPublic++;

            return L.marker(latlng, {icon: L.icon(icons.red)});
          }
          else if (f.CHECKED === 'Y' && f.RFDSTATION !== null){
            MapEvents.graphOptions.yPublic++;

            return L.marker(latlng, {icon: L.icon(icons.orange)});
          }
          else {
            return L.marker(latlng, {icon: L.icon(icons.public)});
          }

        }
        //Private/Other
        else {
          if(f.CHECKED === 'N' && f.RFDSTATION !== null){
            MapEvents.graphOptions.nPrivate++;

            return L.marker(latlng, {icon: L.icon(icons.blue)});
          }
          else if (f.CHECKED === 'Y' && f.RFDSTATION !== null){
            MapEvents.graphOptions.yPrivate++;

            return L.marker(latlng, {icon: L.icon(icons.yellow)});
          }
          else {
            return L.marker(latlng, {icon: L.icon(icons.private)});
          }
        }

      },

      //Sets hydrant styles
      filters: [
        {
          name: 'Checked',
          style: function (feature){
            switch (feature.properties.CHECKED) {
              case 'N': return {
                fillColor: '#ff0000',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
                radius: 4
              };
              case 'Y': return {
                  fillColor: '#0008ff',
                  color: '#000',
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8,
                  radius: 4
                };
              }
            },
          legend: {
            position: 'bottomleft',
            colors: [ "url('images/firehydrants/scaled-at-25/Orange.png'); background-size: 17px 17px;", "url('images/firehydrants/scaled-at-25/Yellow.png'); background-size: 17px 17px;", "url('images/firehydrants/scaled-at-25/Red.png'); background-size: 17px 17px;", "url('images/firehydrants/scaled-at-25/Blue.png'); background-size: 17px 17px;"],
            labels: [ 'Checked (Public)', 'Checked (Prvate)', 'Not Checked (Public)', 'Not Checked (Private)']
          },
          setIcons: function (feature, latlng) {
            var that = this;
            console.log(that);
            var f = feature.properties;
            //Public
            if(f.OWNEDBY === 0){
              if(f.CHECKED === 'N' && f.RFDSTATION !== null){
                MapEvents.filters[0].graphOptions.nPublic++;
                return L.marker(latlng, {icon: L.icon(icons.red)});
              }
              else if (f.CHECKED === 'Y' && f.RFDSTATION !== null){
                MapEvents.filters[0].graphOptions.yPublic++;
                return L.marker(latlng, {icon: L.icon(icons.orange)});
              }
              else {
                return L.marker(latlng, {icon: L.icon(icons.public)});
              }

            }
            //Private/Other
            else {
              if(f.CHECKED === 'N' && f.RFDSTATION !== null){
                MapEvents.filters[0].graphOptions.nPrivate++;
                return L.marker(latlng, {icon: L.icon(icons.blue)});
              }
              else if (f.CHECKED === 'Y' && f.RFDSTATION !== null){
                MapEvents.filters[0].graphOptions.yPrivate++;
                return L.marker(latlng, {icon: L.icon(icons.yellow)});
              }
              else {
                return L.marker(latlng, {icon: L.icon(icons.private)});
              }
            }
          },
          graphOptions: {
            yPublic: 0,
            nPublic: 0,
            yPrivate: 0,
            nPrivate: 0,
            chartlabels: ['Checked (Public)', 'Checked (Prvate)', 'Not Checked (Public)', 'Not Checked (Private)'],
            colours: [orange, yellow, red, blue]
          },
          getData: function(){
            var that = this;
            console.log(that);
            var deferred = $q.defer();
            $timeout(function(){
              var d = that.graphOptions;
              deferred.resolve([
                [d.yPublic],
                [d.yPrivate],
                [d.nPublic],
                [d.nPrivate]
              ]);
            }, 500);
            return deferred.promise;
          },
        },
        {
          name: 'Repairs',
          style: function (feature){
            switch (feature.properties.REPAIRNEED) {
              case 0: return {
                fillColor: '#0008ff',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
                radius: 4
              };
              case 1: return {
                  fillColor: '#ff0000',
                  color: '#000',
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8,
                  radius: 4
                };
              }
            },
            legend: {
              position: 'bottomleft',
              colors: [ "url('images/firehydrants/scaled-at-25/Orange.png'); background-size: 17px 17px;", "url('images/firehydrants/scaled-at-25/Yellow.png'); background-size: 17px 17px;", "url('images/firehydrants/scaled-at-25/Red.png'); background-size: 17px 17px;", "url('images/firehydrants/scaled-at-25/Blue.png'); background-size: 17px 17px;"],
              labels: [ 'Needs Repair (Public)', 'Needs Repair (Prvate)', 'No Repair Needed (Public)', 'No Repair Needed (Private)']
            },
            setIcons: function (feature, latlng) {
              var f = feature.properties;
              //Public
              if(f.OWNEDBY === 0){
                if(f.REPAIRNEED === 0 && f.RFDSTATION !== null){
                  MapEvents.filters[1].graphOptions.nPublic++;
                  return L.marker(latlng, {icon: L.icon(icons.red)});
                }
                else if (f.REPAIRNEED === 1 && f.RFDSTATION !== null){
                  MapEvents.filters[1].graphOptions.yPublic++;
                  return L.marker(latlng, {icon: L.icon(icons.orange)});
                }
                else {
                  return L.marker(latlng, {icon: L.icon(icons.public)});
                }

              }
              //Private/Other
              else {
                if(f.REPAIRNEED === 0 && f.RFDSTATION !== null){
                  MapEvents.filters[1].graphOptions.nPrivate++;
                  return L.marker(latlng, {icon: L.icon(icons.blue)});
                }
                else if (f.REPAIRNEED === 1 && f.RFDSTATION !== null){
                  MapEvents.filters[1].graphOptions.yPrivate++;
                  return L.marker(latlng, {icon: L.icon(icons.yellow)});
                }
                else {
                  return L.marker(latlng, {icon: L.icon(icons.private)});
                }
              }
            },
            graphOptions: {
              yPublic: 0,
              nPublic: 0,
              yPrivate: 0,
              nPrivate: 0,
              chartlabels: ['Needs Repair (Public)', 'Needs Repair (Prvate)', 'No Repair Needed (Public)', 'No Repair Needed (Private)'],
              colours: [orange, yellow, red, blue]
            },
            getData: function(){
              var that = this;
              var deferred = $q.defer();
              $timeout(function(){
                var d = that.graphOptions;
                deferred.resolve([
                  [d.yPublic],
                  [d.yPrivate],
                  [d.nPublic],
                  [d.nPrivate]
                ]);
              }, 500);
              return deferred.promise;
            },
        },
         {
          name: 'Operable',
          style:function (feature){
            switch (feature.properties.OPERABLE) {
              case 'Y': return {
                fillColor: '#0008ff',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
                radius: 4
              };
              case 'N': return {
                fillColor: '#ff0000',
                color: '#000',
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8,
                  radius: 4
                };
              }
            },
            legend: {
              position: 'bottomleft',
              colors: [ "url('images/firehydrants/scaled-at-25/Orange.png'); background-size: 17px 17px;", "url('images/firehydrants/scaled-at-25/Yellow.png'); background-size: 17px 17px;", "url('images/firehydrants/scaled-at-25/Red.png'); background-size: 17px 17px;", "url('images/firehydrants/scaled-at-25/Blue.png'); background-size: 17px 17px;"],
              labels: [ 'Operable (Public)', 'Operable (Prvate)', 'Not Operable (Public)', 'Not Operable (Private)']
            },
            setIcons: function (feature, latlng) {
              var that = this;
              console.log(that);
              var f = feature.properties;
              //Public
              if(f.OWNEDBY === 0){
                if(f.OPERABLE === 'N' && f.RFDSTATION !== null){
                  MapEvents.filters[2].graphOptions.nPublic++;
                  return L.marker(latlng, {icon: L.icon(icons.red)});
                }
                else if (f.OPERABLE === 'Y' && f.RFDSTATION !== null){
                  MapEvents.filters[2].graphOptions.yPublic++;
                  return L.marker(latlng, {icon: L.icon(icons.orange)});
                }
                else {
                  return L.marker(latlng, {icon: L.icon(icons.public)});
                }

              }
              //Private/Other
              else {
                if(f.OPERABLE === 'N' && f.RFDSTATION !== null){
                  MapEvents.filters[2].graphOptions.nPrivate++;
                  return L.marker(latlng, {icon: L.icon(icons.blue)});
                }
                else if (f.OPERABLE === 'Y' && f.RFDSTATION !== null){
                  MapEvents.filters[2].graphOptions.yPrivate++;
                  return L.marker(latlng, {icon: L.icon(icons.yellow)});
                }
                else {
                  return L.marker(latlng, {icon: L.icon(icons.private)});
                }
              }
            },
            graphOptions: {
              yPublic: 0,
              nPublic: 0,
              yPrivate: 0,
              nPrivate: 0,
              chartlabels: ['Operable (Public)', 'Operable (Prvate)', 'Not Operable (Public)', 'Not Operable (Private)'],
              colours: [orange, yellow, red, blue]
            },
            getData: function(){
              var that = this;
              console.log(that);
              var deferred = $q.defer();
              $timeout(function(){
                var d = that.graphOptions;
                deferred.resolve([
                  [d.yPublic],
                  [d.yPrivate],
                  [d.nPublic],
                  [d.nPrivate]
                ]);
              }, 500);
              return deferred.promise;
            },
        }
      ],
      setHydrantStyle: function (feature){
        switch (feature.properties.REPAIRNEED) {
          case 0: return {
            fillColor: '#0008ff',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
            radius: 4
          };
          case 1: return {
              fillColor: '#ff0000',
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8,
              radius: 4
            };
          }
        },


        // Mouse over function, called from the Leaflet Map Events
        hydrantMouseover: function (feature, leafletEvent) {
          var f = feature.properties,
              checked = f.CHECKED === 'Y' ? 'Yes' : 'No',
              repair = f.REPAIRNEED ? 'No' : 'Yes',
              operable = f.OPERABLE === 'Y' ? 'Yes' : 'No';



            var marker = leafletEvent.target;
            marker.bindPopup("<b>Facility ID: " + f.FACILITYID + "</b><br>Checked: "+ checked + "</b><br>Needs Repair: " + repair + "</b><br>Operable: " + operable).openPopup();
            return feature;
        },
        onEachFeature: function (feature, layer) {
          var f = feature.properties,
              checked = f.CHECKED === 'Y' ? 'Yes' : 'No',
              repair = f.REPAIRNEED ? 'No' : 'Yes',
              operable = f.OPERABLE === 'Y' ? 'Yes' : 'No';
              layer.bindPopup("<b>Facility ID: " + f.FACILITYID + "</b><br>Checked: "+ checked + "</b><br>Needs Repair: " + repair + "</b><br>Operable: " + operable).openPopup();
        },

        //Zoom to feature on click
        zoomToFeature: function (featureSelected){
          leafletData.getMap().then(function(map) {
            var coords = [featureSelected.geometry.coordinates[1], featureSelected.geometry.coordinates[0]];
            map.setView(coords, 18);
          });
        },



      };

    return (MapEvents);

  }]);
