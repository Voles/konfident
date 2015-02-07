(function () {
  'use strict';

  angular.module('kf')
    .filter('percentageSum', function () {
      return function (input, property) {
        input = input || [];
        var result = 0;

        input.forEach(function (object) {
          result += object[property];
        });

        return result / (input.length);
      };
    });

}());
