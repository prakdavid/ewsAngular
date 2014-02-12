var app = angular.module('ews');

app.directive('topmenu', function () {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/topmenu/template.html',
      controller:  'TopMenuController',
      scope: {
        title: '@'
      }

    };
});