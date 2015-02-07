(function () {
  'use strict';

  angular.module('kf')
    .filter('filenameFromUrl', function () {
      return function (url) {
        url = url || '';

        var startIndex = url.lastIndexOf('/') + 1;
        return url.substr(startIndex, url.length);
      };
    });

}());
