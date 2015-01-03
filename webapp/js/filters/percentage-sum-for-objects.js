(function () {
  'use strict';

  angular.module('kf')
    .filter('percentageSumForObjects', function () {
      return function (objects, property) {
        var result = 0;
        objects = objects || {};
        Object.keys(objects).forEach(function (key) {
          result += objects[key][property];
        });

        return result / (Object.keys(objects).length);
      };
    })

}());
