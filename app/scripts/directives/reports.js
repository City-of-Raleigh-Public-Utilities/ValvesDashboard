'use strict';

/**
 * @ngdoc directive
 * @name valvessDashboard.directive:repots
 * @description
 * # repots
 */
angular.module('valvesDashboard')
  .directive('reports', ['reports', '$filter', function (reports, $filter) {
    return {
      templateUrl: 'views/reports.html',
      restrict: 'E',
      transclude: true,
      link: function postLink(scope, element, attrs) {
        scope.today = $filter('date')(new Date(), 'yyyyMMdd');

        scope.layerList = [
          {name:'Contractor Cut Off - System Valves'},
          {name:'Permalogger - System Valves'},
          {name:'Repair Needed - System Valves'},
          {name:'Repair Needed - Control Valves'}
        ];

        scope.layer = scope.layerList[0];

        scope.$parent.myData = [{name: "Moroni", age: 50},
                     {name: "Tiancum", age: 43},
                     {name: "Jacob", age: 27},
                     {name: "Nephi", age: 29},
                     {name: "Enos", age: 34}];
        scope.gridOptions = {
          data: 'myData',
          filterOptions: {filterText: '', useExternalFilter: false},
          enableColumnResize: true,
          enableSorting: true
        };

        console.log(scope);


        reports.getReport(scope.layer.name)
          .then(function(res){
            if(res.error){
              console.log(res.error);
            }
            else {
              console.log(res);
              scope.reportData = [];
              res.features.forEach(function(f){
                scope.reportData.push(f.attributes);
              });
              // return scope.reportData;
              // scope.data = res.features;

            }
          }, function(err){
            console.log(err);
          });

          scope.getReport = function(){
            scope.newReportPromise = reports.getReport(scope.layer.name)
              .then(function(res){
                if(res.error){
                  console.log(res.error);
                }
                else {
                  scope.reportData = [];
                  res.features.forEach(function(f){
                    scope.reportData.push(f.attributes);
                  });
                }
              }, function(err){
                console.log(err);
              });
          };
      }



    };


  }]);
