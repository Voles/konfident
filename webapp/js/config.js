(function () {
  'use strict';

  angular.module('kf')
    .config(function ($routeProvider) {
      $routeProvider
        .when('/compare/:masterDirectory?/:selectedDirectory?', {
          controller: 'CompareController',
          templateUrl: 'js/pages/compare/compare.html'
        })
        .otherwise({
          redirectTo: 'compare'
        });
    })

    .constant('apiPrefix', 'http://localhost:8008');
}());