var app = angular.module('ews');

app.controller('AccountSettingController', function($scope, $http, $location, $localStorage) {
    $scope.session = $localStorage.session;
    $scope.toto = {
        accountname: "raphaelmerrot",
        accountmail: "raphael.merrot@gmail.com",
        account_type: ['enterprise', 'student']
    };
    // pour instant le password est en clair, je me hacherai plus tard
    $scope.edit = function(){
        $scope.data = {
            'class':   'Account',
            'function':'edit',
            // 'data':    {'user_mail':'raphael.merrot@gmail.com', 'user_password':'cerise'}
            'data': {'user_mail': $scope.user_mail, 'user_password': $scope.user_password }
        };
        console.log("edit");

        // $http({
        //     url: 'api/modules/dispatcher.php',
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     data: $scope.data
        // }).success(function(data, status, headers, config)
        // {
        //     SessionService.setSession(data.session);
        //     $location.path('/');
        // })
        // .error(function(data, status, headers, config)
        // {
        //     // SessionService.setUserAuthenticated(false);
        // });
    };
    $scope.delete = function(){

        console.log("delete");
    };
});