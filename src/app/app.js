var app = angular.module('ews', ['ngRoute']);

app.run(function($rootScope) {
    $rootScope.name = "David";
});
  
app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            // Faudrait mettre le cas ou on est pas loggé
            when('/dashboard', {
                templateUrl: '../partials/dashboard.html',
                controller: 'DashboardController'
            }).
            when('/ShowOrders', {
                templateUrl: '../partials/show_orders.html',
                controller: 'ShowOrdersController'
            }).
            otherwise({
                redirectTo: '/dashboard'
            });
    }]
);
 
 
app.controller('ShowOrdersController', function($scope) {
    console.log("ShowOrdersController");
    $scope.message = 'This is Show orders screen';
 
});