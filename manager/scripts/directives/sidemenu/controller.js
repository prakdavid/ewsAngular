var app = angular.module('ews');

app.controller('SideMenuController', function($scope, $localStorage) {
    $scope.currentUser         = $localStorage.session;
    $scope.cloudaccountsbyname = $localStorage.cloudaccountsbyname;
    $scope.cloudaccountsbyid   = $localStorage.cloudaccountsbyid;
});