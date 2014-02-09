/*! ews 2014-02-09 */
var app = angular.module('ews', ['ngRoute']);

app.run(function($rootScope) {
    $rootScope.name = "David";
});
  
app.config(['$httpProvider','$routeProvider',
    function($httpProvider, $routeProvider) {
        $routeProvider.
            // Faudrait mettre le cas ou on est pas loggé
            when('/', {
                templateUrl: '../partials/dashboard.html',
                controller: 'DashboardController'
            }).
            when('/login', {
                templateUrl: '../partials/login.html',
                controller: 'LoginController'
            }).
            otherwise({
                redirectTo: '/'
            });
        // $httpProvider.interceptors.push('IntercepteurHTTP');
    }]
);

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
var app = angular.module('ews');

app.controller('LoginController', function($scope, $rootScope, $http, $location) {


    // pour instant le password est en clair, je me hacherai plus tard
    $scope.login = function(){
        $scope.data = {
            'class':   'Account',
            'function':'login',
            // 'data':    {'user_mail':'raphael.merrot@gmail.com', 'user_password':'cerise'}
            'data': {'user_mail': $scope.user_mail, 'user_password': $scope.user_password}
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
    };
});
var app = angular.module('ews');

app.controller('SideMenuController', function($scope) {
    console.log("SideMenuController");
     
});
var app = angular.module('ews');

app.directive('sidemenu', function () {
    return {
        restrict:    'E',
        templateUrl: 'app/scripts/directives/sidemenu/template.html',
        controller:  'SideMenuController'
    };
});
var app = angular.module('ews');
// Intercepteur HTTP
app.factory('IntercepteurHTTP', function ($q, $location) {
    return function (promise) {
        return promise.then(
        function (response) {
            return response; // ne rien faire si il n'a pas d'erreurs'
        },
        function (response) {
            // fonction qui sera executé si Angular reçoit une erreur http
            console.log(response.status, ">>> status");
            if (response.status === "401") { // on teste si c'est une erreur 401'
               $location.path('/login'); // l'utilisateur sera redirigé vers la partie login
            }
            return $q.reject(response);
        }
        );
    };
});
