'use strict';

/**
 * @ngdoc directive
 * @name hydrantsDashboardApp.directive:login
 * @description
 * # login
 */
angular.module('valvesDashboard')
  .directive('loginForm', [ 'agsFactory', '$location', '$localStorage', function (agsFactory, $location, $localStorage) {
        return {
          restrict: 'E',
          templateUrl: 'views/login-form.html',
          controller: function ($scope) {
            $scope.token = '';
            $scope.loggedIn = true;
            $scope.login = function (user, password) {
              var options = {
                username: user,
                password: password,
                expiration: 60,
                f: 'json'
              };
              agsFactory.login(options).then(function (token) {
              // agsFactory.getToken().then(function (token) {
                $scope.token = token;
                $scope.loggedIn = token;
                $localStorage.token= token.token;
                $localStorage.expires= token.expires;
                if (token) {
                  $scope.modal.modal('hide');
                }
                // else {
                //   $location.url('/');
                // }
              },
              function(err){
                $location.url('/valves');
              });
            };
          },
          link: function (scope, element, attrs) {
            scope.status = agsFactory.isTokenValid($localStorage.expires);
            if(!scope.status){
              scope.modal = $('.modal', element[0]);
              scope.modal.modal({keyboard: false, backdrop: 'static'});
            }
          }
        }
      }]);
