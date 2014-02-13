var app = angular.module('ews',
    [
        'ngRoute',
        'ngCookies',
        'ngStorage',
        'ngAnimate',
        'toaster',
        'ngTable',
        'http-auth-interceptor',
        'login',
        'main'
    ]);

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
            when('/clouds/instance/:id', {
                templateUrl:        '../partials/instance.html',
                controller:         'InstanceController',
                requireLogin:       true
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

app.directive('authApp', function($cookies, authService) {
    return {
        restrict: 'C',
        link: function(scope, elem, attrs) {
            //once Angular is started, remove class:
            elem.removeClass('wait-auth');
            
            var login = elem.find('#login-page');
            var main  = elem.find('#content-page');
            
            if ($cookies.session !== undefined) {
                authService.loginConfirmed();
                login.hide();
            } else {
                main.hide();
            }
            
            scope.$on('event:auth-loginRequired', function() {
                login.slideDown('slow', function() {
                    main.hide();
                });
            });
            scope.$on('event:auth-loginConfirmed', function() {
                main.show();
                login.slideUp();
            });
        }
    };
});
