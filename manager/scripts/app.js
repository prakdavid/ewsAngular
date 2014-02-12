var app = angular.module('ews', ['ngRoute', 'ngCookies', 'ngStorage']);
  
app.config(['$httpProvider','$routeProvider',
    function($httpProvider, $routeProvider) {
        $routeProvider.
            // Faudrait mettre le cas ou on est pas loggé
            when('/dashboard', {
                templateUrl:        '../partials/dashboard.html',
                controller:         'DashboardController',
                requireLogin:       true
            }).
            when('/account/settings', {
                templateUrl:        '../partials/account/accountsettings.html',
                controller:         'AccountSettingController',
                requireLogin:       true
            }).
            when('/account/usersettings/:id', {
                templateUrl:        '../partials/account/usersettings.html',
                controller:         'UserSettingController',
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
                redirectTo:         '/dashboard'
            });
    }]
);
