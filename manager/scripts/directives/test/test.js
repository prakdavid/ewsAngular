var app = angular.module('ews');

app.directive('test', function () {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/test/template.html',
      controller:  'testController',
      scope: {
        title: '@'
      }

    };
});