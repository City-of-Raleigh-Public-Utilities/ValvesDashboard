'use strict';

/**
 * @ngdoc service
 * @name hydrantsDashboardApp.icons
 * @description
 * # icons
 * Factory in the hydrantsDashboardApp.
 */
angular.module('hydrantsDashboard')
  .factory('icons', function () {
    var local_icons = {
        defaultIcon: {},
        public: {
            iconUrl: 'images/firehydrant-assets/scaled-at-25/Layer 1.png',
            iconSize:     [20, 30], // size of the icon
        },
        private: {
          iconUrl: 'images/firehydrant-assets-private/scaled-at-25/Layer 1.png',
          iconSize:     [20, 30]
        },
        publicTrue: {
          iconUrl: 'images/firehydrant-assets-public-true/scaled-at-25/Layer 1.png',
          iconSize:     [20, 30]
        },
        publicFalse: {
          iconUrl: 'images/firehydrant-assets-public-false/scaled-at-25/Layer 1.png',
          iconSize:     [20, 30]
        },
        privateTrue: {
          iconUrl: 'images/firehydrant-assets-private-green/scaled-at-25/Layer 1.png',
          iconSize:     [20, 30]
        },
        privateFalse:{
          iconUrl: 'images/firehydrant-assets-private-false/scaled-at-25/Layer 1.png',
          iconSize:     [20, 30]
        },
        red: {
            iconUrl: 'images/firehydrants/scaled-at-25/Red.png',
            iconSize:     [20, 30], // size of the icon
        },
        green: {
          iconUrl: 'images/firehydrants/scaled-at-25/Green.png',
          iconSize:     [20, 30]
        },
        blue: {
          iconUrl: 'images/firehydrants/scaled-at-25/Blue.png',
          iconSize:     [20, 30]
        },
        yellow: {
          iconUrl: 'images/firehydrants/scaled-at-25/Yellow.png',
          iconSize:     [20, 30]
        },
        purple: {
          iconUrl: 'images/firehydrants/scaled-at-25/Purple.png',
          iconSize:     [20, 30]
        },
        orange:{
          iconUrl: 'images/firehydrants/scaled-at-25/Orange.png',
          iconSize:     [20, 30]
        }
    };

    return (local_icons);
  });
