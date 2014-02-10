var app = angular.module('ews');

app.controller('RegisterController', function($scope, $rootScope, $http, $location) {

    // pour instant le password est en clair, je me hacherai plus tard
    $scope.register = function(){
        console.log("RegisterController");
        
        $scope.data = {
            'class':   'Account',
            'function':'register',
            'data': {'user_mail': $scope.user_mail, 'user_password': $scope.user_password}
        };

        $http({
            url: 'api/modules/dispatcher.php',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: $scope.data
        }).success(function(data, status, headers, config)
        {
            console.log(status + ' - ' + data);
            $location.path('/');
        })
        .error(function(data, status, headers, config)
        {
            console.log(data, status, headers, config);
        });
    };
});