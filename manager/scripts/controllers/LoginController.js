var app = angular.module('ews');

app.controller('LoginController', function($scope, $http, $location, $route, $localStorage, $cookies) {
    // pour instant le password est en clair, je me hacherai plus tard
    $scope.login = function(){
        $scope.data = {
            'class':   'Account',
            'function':'login',
            // 'data':    {'user_mail':'raphael.merrot@gmail.com', 'user_password':'cerise'}
            'data': {'user_mail': $scope.user_mail, 'user_password': $scope.user_password }
        };

        $http({
            url: 'api/modules/dispatcher.php',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: $scope.data
        }).success(function(data, status, headers, config)
        {
            $localStorage.session = data.session;
            $location.path('/dashboard');
            window.location.reload();
        })
        .error(function(data, status, headers, config)
        {
            // SessionService.setUserAuthenticated(false);
        });
    };
});