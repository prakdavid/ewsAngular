var app = angular.module('ews');

app.directive('breadcrumbs', function () {
    return {
      restrict: 'E',
      template: '<ul class="breadcrumb">'+
                    '<li ng-if="!title"><i class="fa fa-home"></i>Dashboard</a></li>'+
                    '<li ng-if="title"><i class="fa fa-home"></i><a href="/">Dashboard</a>'+
                    '</li>'+
                    '<li ng-if="title">{{title}}</li>'+
                '</ul>',
      scope: {
        title: '@'
      }
    };
});