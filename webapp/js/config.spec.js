(function () {
  'use strict';

  describe('the konfident application', function () {

    var $rootScope, $route, $injector, $httpBackend;

    beforeEach(module('kf'));
    beforeEach(module('templates'));
    beforeEach(inject(function (_$injector_) {
      $injector     = _$injector_;
      $rootScope    = $injector.get('$rootScope').$new();
      $route        = $injector.get('$route');
      $httpBackend  = $injector.get('$httpBackend');
    }));

    describe('the configuration', function () {
      it('should have an API prefix defined', function () {
        expect($injector.get('apiPrefix')).toBeDefined();
      });
    });

    describe('the default route', function () {
      it('should be the compare route', function () {
        expect($route.routes[null]).toBeDefined();
        expect($route.routes[null].redirectTo).toEqual('compare');
      });
    });

    describe('the compare route', function () {
      it('should exist', function () {
        var routeName = '/compare/:masterDirectory?/:selectedDirectory?';

        expect($route.routes).toBeDefined();
        expect($route.routes[routeName]).toBeDefined();
      });

      it('should have its own controller', function () {
        var routeName = '/compare/:masterDirectory?/:selectedDirectory?';
        expect($route.routes[routeName].controller)
          .toEqual('CompareController');
      });

      it('should have its own view', function () {
        var routeName = '/compare/:masterDirectory?/:selectedDirectory?';
        expect($route.routes[routeName].templateUrl)
          .toBeDefined();

        expect($route.routes[routeName].templateUrl)
          .toEqual('js/pages/compare/compare.html');
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

}());