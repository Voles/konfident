(function () {
  'use strict';

  angular.module('kf')
    .filter('sum', function () {
      return function (input, property) {
        var result = 0;
        input = input || [];
        input.forEach(function (item) {
          result += item[property];
        });

        return result;
      };
    });

}());
