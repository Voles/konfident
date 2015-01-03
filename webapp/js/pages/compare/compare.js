(function () {
  'use strict';

  angular.module('kf')
    .controller('CompareController', function ($scope, $routeParams, $location, $q, $document, $http, CompareImages, apiPrefix) {
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

          if (!$routeParams.masterDirectory) {
            $location.path('/compare/' + directories[0].name + '/' + directories[1].name);
          }

          if (!$routeParams.selectedDirectory) {
            $location.path('/compare/' + directories[0].name + '/' + directories[1].name);
          }

          return directories;
        })
        .then(function (directories) {
          angular.forEach(directories, function (directory) {
            if (directory.name === $routeParams.masterDirectory) {
              $scope.masterDirectory = directory;
            }

            if (directory.name === $routeParams.selectedDirectory) {
              $scope.selectedDirectory = directory;
            }
          });

          // loop over pictures
          var result = {};
          angular.forEach($scope.masterDirectory.pictures, function (picture) {
            if ($scope.masterDirectory.pictures.indexOf(picture) < 0) {
              result[picture] = {};
              return;
            }

            var firstPicturePath = apiPrefix + '/' + $scope.masterDirectory.src + '/' + picture;
            var secondPicturePath = apiPrefix + '/' + $scope.selectedDirectory.src + '/' + picture;

            CompareImages.compare(firstPicturePath, secondPicturePath)
              .then(function (analysis) {
                analysis.firstPicturePath = firstPicturePath;
                analysis.secondPicturePath = secondPicturePath;
                result[picture] = analysis;
              });
          });

          $scope.result = result;
        });
    });

}());