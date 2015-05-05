'use strict';

/**
 * @ngdoc overview
 * @name hydrantsDashboardApp
 * @description
 * # hydrantsDashboardApp
 *
 * Main module of the application.
 */
angular
  .module('valvesDashboard', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'agsserver',
    'leaflet-directive',
    'cgBusy',
    'ngCsv',
    'chart.js'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/valves', {
        templateUrl: 'views/valves.html',
        controller: 'ValvesCtrl'
      })
      .otherwise({
        redirectTo: '/valves'
      });

  });
