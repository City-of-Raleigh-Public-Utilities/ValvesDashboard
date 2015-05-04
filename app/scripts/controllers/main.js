'use strict';

/**
 * @ngdoc function
 * @name hydrantsDashboardApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hydrantsDashboardApp
 */
angular.module('valvesDashboard')
  .controller('MainCtrl',['$anchorScroll', '$location', '$scope', 'FIREDEPTS', function ($anchorScroll, $location, $scope, FIREDEPTS) {
    $scope.departments = FIREDEPTS;


    $scope.gotoAnchor = function() {
      var newHash = 'stations';
      if ($location.hash() !== newHash) {
        // set the $location.hash to `newHash` and
        // $anchorScroll will automatically scroll to it
        $location.hash('stations');
      } else {
        // call $anchorScroll() explicitly,
        // since $location.hash hasn't changed
        $anchorScroll();
      }
    };


  }]);
