'use strict';

/**
 * @ngdoc function
 * @name hydrantsDashboardApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hydrantsDashboardApp
 */
angular.module('hydrantsDashboard')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
