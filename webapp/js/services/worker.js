(function () {
  'use strict';

  angular.module('kf')
    .service('CompareImageDataWorker', function ($q) {
      var promises = {};
      var worker = new Worker('js/workers/compare-image-data.js');

      worker.addEventListener('message', function (message) {
        if (!message.data.cmd) {
          return;
        }

        switch (message.data.cmd) {
          case 'result':
            promises[message.data.info.id].resolve(message.data.info);
            break;
        }
      });

      return {
        start: function (data) {
          var defer = $q.defer();

          worker.postMessage({
            cmd: 'start',
            info: data
          });

          promises[data.id] = defer;

          return promises[data.id].promise;
        },
        stop: function () {
          worker.terminate();
        }
      };
    })
}());