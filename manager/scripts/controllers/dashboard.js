var app = angular.module('ews');

app.controller('DashboardController', function($scope, $http) {
    // console.log("DashboardController");
    $scope.message = 'This is dashboard page';

    // Bon comme il y a absolument aucune facon de communiquer avec API avec ajax
    // donc fuat passer par CURL en PHP, ou bien faut que API authorise CORS
    $scope.data = {
        'class':   'Account',
        'function':'test',
        'data':    {'id':42, 'name':'David'}
    };

    $http({
        url: 'api/dispatcher.php',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: $scope.data
    }).success(function(data, status, headers, config)
    {
        console.log(status + ' - ' + data);
    })
    .error(function(data, status, headers, config)
    {
        console.log('error');
    });
});