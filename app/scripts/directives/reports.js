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

        reports.getReport(scope.layer.name)
          .then(function(res){
            if(res.error){
              console.log(res.error);
            }
            else {
              console.log(res);
              scope.data = res;
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
                  console.log(res);
                  scope.data = res;
                }
              }, function(err){
                console.log(err);
              });
          };
      }
    };


  }]);
