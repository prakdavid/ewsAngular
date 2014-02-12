var app = angular.module('ews');

app.directive('sidemenu', function () {
    return {
        restrict:    'E',
        templateUrl: 'scripts/directives/sidemenu/template.html',
        controller:  'SideMenuController'
    };
});