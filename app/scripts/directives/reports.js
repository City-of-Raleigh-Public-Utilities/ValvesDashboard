'use strict';

/**
 * @ngdoc directive
 * @name valvessDashboard.directive:repots
 * @description
 * # repots
 */
angular.module('valvesDashboard')
  .directive('reports', [ function () {
    return {
      templateUrl: 'views/reports.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the repots directive');
      }
    };
  });
