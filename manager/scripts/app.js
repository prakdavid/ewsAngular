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
