(function () {
  'use strict';
   var $scope, $routeParams, $controller, $location;

  describe('the compare controller', function () {
    beforeEach(module('templates'));
    beforeEach(module('kfE2E'));
    beforeEach(inject(function (_$rootScope_, _$routeParams_, _$controller_, _$location_) {
      $scope = _$rootScope_.$new();
      $routeParams = _$routeParams_;
      $controller = _$controller_;
      $location = _$location_;
    }));

    function createCtrl() {
      var ctrl = $controller('CompareController', {
        $scope: $scope,
        $routeParams: $routeParams
      });

      $scope.$digest();

      return ctrl;
    }

    it('should contain picture directories on initialization', function () {
      var ctrl = createCtrl();
      expect($scope.directories).toBeDefined();
    });

    it('should have a master directory defined', function () {
      $routeParams.masterDirectory = '2014-12-13';
      $routeParams.selectedDirectory = '2014-12-14';

      var ctrl = createCtrl();
      $scope.$digest();

      expect($scope.masterDirectory).toBeDefined();
    });

    it('should have a selected directory defined', function () {
      $routeParams.masterDirectory = '2014-12-13';
      $routeParams.selectedDirectory = '2014-12-14';

      var ctrl = createCtrl();
      $scope.$digest();

      expect($scope.selectedDirectory).toBeDefined();
    });

    it('should set the master and selected directory to reflect the $routeParams', function () {
      spyOn($location, 'path');

      var ctrl = createCtrl();

      $scope.directories = [{
        id: '2014-12-13',
        name: 'Initial build'
      }, {
        id: '2014-12-14',
        name: 'Future build'
      }];

      $routeParams.masterDirectory = '2014-12-13';
      $routeParams.selectedDirectory = '2014-12-14';
      $scope.$digest();

      expect($location.path).toHaveBeenCalledWith('/compare/2014-12-13/2014-12-14');

      $routeParams.masterDirectory = '2014-12-14';
      $routeParams.selectedDirectory = '2014-12-13';
      $scope.$digest();

      expect($location.path).toHaveBeenCalledWith('/compare/2014-12-13/2014-12-14');
    });

    it('should contain the diffed pictures when there are two directories selected', function () {
      var ctrl = createCtrl();

      $scope.directories = [{
        id: '2014-12-13',
        name: 'Initial build'
      }, {
        id: '2014-12-14',
        name: 'Future build'
      }];

      $routeParams.masterDirectory = '2014-12-13';
      $routeParams.selectedDirectory = '2014-12-14';
      $scope.$digest();

      var result = ctrl.generateDiffedPictures('2014-12-13', '2014-12-14');

      expect($scope.diffedPictures).toBeDefined();
      expect(result).toEqual([{
        filename: 'title.png',
        src: 'diff/title.png'
      }]);
    });

    describe('the diffed pictures generator', function () {
      it('should only compare images which are present in both directories', function () {

      });
    });
  });

}());