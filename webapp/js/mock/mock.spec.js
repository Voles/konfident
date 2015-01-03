angular.module('kfE2E', ['kf']).run(function ($httpBackend) {
  $httpBackend.whenGET('http://localhost:8008/directories?rootDir=p3')
    .respond({});
});