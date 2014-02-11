var app = angular.module('ews', ['ngRoute', 'ngCookies', 'ngStorage']);
  
app.config(['$httpProvider','$routeProvider',
    function($httpProvider, $routeProvider) {
        $routeProvider.
            // Faudrait mettre le cas ou on est pas loggé
            when('/', {
                templateUrl:        '../partials/dashboard.html',
                controller:         'DashboardController',
                requireLogin:       true
            }).
            when('/account/settings', {
                templateUrl:        '../partials/account/accountsettings.html',
                controller:         'AccountSettingController',
                requireLogin:       true
            }).
            when('/login', {
                templateUrl:        '../partials/login.html',
                controller:         'LoginController',
                requireLogin:       false
            }).
            when('/register', {
                templateUrl:        '../partials/register.html',
                controller:         'RegisterController',
                requireLogin:       false
            }).
            otherwise({
                redirectTo:         '/'
            });
    }]
);

app.run(function($rootScope, $location, $cookies, $http) {
    $rootScope.isUserLooged = ($cookies.session !== undefined) ? true : false;
    // $cookies.session = "eyJfZnJlc2giOnRydWUsIl9pZCI6eyIgYiI6Ik9EUXlPVFptT1RBd1l6ZzVZV1EzWW1RMk1XSTJORE0xWTJaaU1HRXpNelE9In0sInVzZXJfaWQiOiIxIn0.BdqXJw.DQbGH8tqXBZ2MGbCFAF4_omBMZY";
    // console.log($cookies.session);

    // On surveille la route
    $rootScope.$on("$routeChangeStart", function(event, next, current) {

        // Si dans route la variable requireLogin est true, alors on check l'authentication
        if (next.requireLogin) {
            // Auth/session check here
            if ($cookies.session === undefined) {
                $location.path('/login');
                event.preventDefault();
            }
        }
    });

    $rootScope.logout = function () {
        $http({
            url: 'api/modules/dispatcher.php',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: { 'class':   'Account','function':'logout'}
        }).success(function(data, status, headers, config) {
            $location.path('/login');
        }).error(function(data, status, headers, config) {
        });
    };
});