(function () {
  'use strict';
  var $scope, $route, $controller, $location, $httpBackend;

  describe('the compare controller', function () {
    beforeEach(module('kf'));
    beforeEach(module('templates'));
    beforeEach(inject(function ($injector) {
      $scope = $injector.get('$rootScope').$new();
      $route = $injector.get('$route');
      $controller = $injector.get('$controller');
      $location = $injector.get('$location');
      $httpBackend = $injector.get('$httpBackend');

      $httpBackend.whenGET('http://localhost:8008/directories?rootDir=p3')
        .respond([
          {
            'name': 'v1',
            'src': 'uploaded/p3/v1',
            'pictures': ['overview.png', 'menu.png']
          },
          {
            'name': 'v2',
            'src': 'uploaded/p3/v2',
            'pictures': ['overview.png', 'menu.png']
          }
        ]);
    }));

    function createCtrl() {
      var ctrl = $controller('CompareController', {
        $scope: $scope,
        $route: $route,
        $location: $location
      });

      $httpBackend.flush();
      $scope.$digest();

      return ctrl;
    }

    it('should contain picture directories on initialization', function () {
      createCtrl();
      expect($scope.directories).toBeDefined();
    });

    it('should have a master directory defined that reflects the $routeParams', function () {
      $location.path('/compare/v1/v2');
      createCtrl();
      expect($scope.masterDirectory).toBeDefined();
    });

    it('should have a selected directory defined that reflects the $routeParams', function () {
      $location.path('/compare/v1/v2');
      createCtrl();
      expect($scope.selectedDirectory).toBeDefined();
    });
  });

}());