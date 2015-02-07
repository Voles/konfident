(function () {
  'use strict';

  angular.module('kf')
    .controller('CompareController',
    function ($scope, $route, $location, $q, $document, $http, $filter, CompareImages, apiPrefix) {
      $scope.analysis = {};
      var originPath = 'p3';

      $scope.$watch('masterDirectory.name', function (name) {
        if (!$scope.selectedDirectory) {
          return;
        }

        $location.path('/compare/' + name + '/' + $scope.selectedDirectory.name);
      });

      $scope.$watch('selectedDirectory.name', function (name) {
        if (!$scope.masterDirectory) {
          return;
        }

        $location.path('/compare/' + $scope.masterDirectory.name + '/' + name);
      });

      this.fetchDirectories = function (originPath) {
        var defer = $q.defer();

        $http.get(apiPrefix + '/directories?rootDir=' + originPath).then(function (response) {
          defer.resolve(response.data);
        });

        return defer.promise;
      };

      this.fetchDirectories(originPath)
        .then(function (directories) {
          $scope.directories = directories;

          if (!directories) {
            return $q.reject('No directories available');
          }

          if (!$route.current.params.masterDirectory) {
            $location.path('/compare/' + directories[0].name + '/' + directories[1].name);
            return $q.reject('No master directory defined');
          }

          if (!$route.current.params.selectedDirectory) {
            $location.path('/compare/' + directories[0].name + '/' + directories[1].name);
            return $q.reject('No selected directory defined');
          }

          return directories;
        })
        .then(function (directories) {
          angular.forEach(directories, function (directory) {
            if (directory.name === $route.current.params.masterDirectory) {
              $scope.masterDirectory = directory;
            }

            if (directory.name === $route.current.params.selectedDirectory) {
              $scope.selectedDirectory = directory;
            }
          });

          // loop over pictures
          var analysisQueue = [];
          angular.forEach($scope.masterDirectory.pictures, function (picture) {
            var firstPicturePath = apiPrefix + '/' + $scope.masterDirectory.src + '/' + picture;
            var secondPicturePath = apiPrefix + '/' + $scope.selectedDirectory.src + '/' + picture;

            var compareTask = CompareImages.compare(firstPicturePath, secondPicturePath)
              .then(function (analysis) {
                analysis.firstPicturePath = firstPicturePath;
                analysis.secondPicturePath = secondPicturePath;
                return analysis;
              });

            analysisQueue.push(compareTask);
          });

          $q.all(analysisQueue)
            .then(function (result) {
              $scope.result = result;
            });
        });

      $scope.resultToColor = function (result) {
        var res = $filter('percentageSum')(result, 'misMatchPercentage');
        var hue = (1 - (res / 100)) * 120;
        return 'hsl(' + hue + ', 100%, 50%)';
      };
    });

}());