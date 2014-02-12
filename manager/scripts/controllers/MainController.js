var app = angular.module('ews');

app.controller('MainController', function($scope, $location, $route, $cookies, $http, $localStorage) {
	$scope.isUserLooged = ($cookies.session !== undefined) ? true : false;

	// On surveille la route
	$scope.$on("$routeChangeStart", function(event, next, current) {
		// Si dans route la variable requireLogin est true, alors on check l'authentication
		if (next.requireLogin) {
			// Auth/session check here
			if ($cookies.session === undefined) {
				$location.path('/login');
				event.preventDefault();
			}
		}
	});

	$scope.getStateVm = function() {
		$http({
			url: 'api/modules/dispatcher.php',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: { 'class':   'Clouds','function':'cloudaccount'}
		}).success(function(data, status, headers, config) {
			$localStorage.cloudaccountsbyname = data.cloudaccountsbyname;
			$localStorage.cloudaccountsbyid   = data.cloudaccountsbyid;
		}).error(function(data, status, headers, config) {
		});
	};
	$scope.getStateVm();
});