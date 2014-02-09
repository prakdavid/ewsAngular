var app = angular.module('ews');

app.directive('sidemenu', function () {
    return {
        restrict:    'E',
        templateUrl: 'app/scripts/directives/sidemenu/template.html',
        controller:  'SideMenuController'
    };
});