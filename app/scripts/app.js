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
  .module('hydrantsDashboard', [
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
  .constant('FIREDEPTS', [
     {
      'name': 'City of Raleigh Fire Department',
      'title': 'Raleigh',
      'icon': 'images/Raleigh_Fire_Department_Logo.png'
    },
    {
      'name': 'Town of Garner Fire Department',
      'title': 'Garner',
      'icon': 'images/garner.png'
    },
     {
      'name': 'Town of Wake Forest Fire Department',
      'title': 'Wake Forest',
      'icon': 'images/wakeforest_logo.jpg'
    },
     {
      'name': 'Town of Zebulon Fire Department',
      'title': 'Zebulon',
      'icon': 'images/ZFD Patch.jpg'
    },
    {
      'name': 'Town of Knightdale Fire Department',
      'title': 'Knightdale',
      'icon': 'images/kdaleseal.png'
    },
    {
      'name': 'Town of Wendell Fire Department',
      'title': 'Wendell',
      'icon': 'images/wendellfire6.jpg'
    },
    {
      'name': 'Town of Rolesville Fire Department',
      'title': 'Rolesville',
      'icon': 'images/firehydrant-assets/scaled-at-25/Layer 1.png'
    },
    {
      'name': 'Wake-New Hope',
      'title': 'Wake-New Hope',
      'icon': 'images/WakeNewHopePatch.png'
    },
     {
      'name': 'Eastern Wake Fire Department',
      'title': 'Eastern Wake',
      'icon': 'images/easternwake.png'
    }
  ])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      // .when('/about', {
      //   templateUrl: 'views/about.html',
      //   controller: 'AboutCtrl'
      // })
      .when('/responseZone/:zone', {
        templateUrl: 'views/responsezone.html',
        controller: 'ResponsezoneCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contacts.html',
        controller: 'ContactsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  });
