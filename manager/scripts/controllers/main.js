var app = angular.module('ews');

app.controller('MainCtrl', function($scope, $location, $route, $cookies, $http, $localStorage) {
	$scope.isUserLooged = ($cookies.session !== undefined) ? true : false;
	$scope.currentUser = $localStorage.session;
	// $cookies.session = "eyJfZnJlc2giOnRydWUsIl9pZCI6eyIgYiI6Ik9EUXlPVFptT1RBd1l6ZzVZV1EzWW1RMk1XSTJORE0xWTJaaU1HRXpNelE9In0sInVzZXJfaWQiOiIxIn0.BdqXJw.DQbGH8tqXBZ2MGbCFAF4_omBMZY";
	// console.log($cookies.session);
	// delete $cookies.session;

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
			console.log(data);
		}).error(function(data, status, headers, config) {
		});
	};
	// $scope.getStateVm();

	$scope.logout = function () {
		console.log("log out");
		$http({
			url: 'api/modules/dispatcher.php',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: { 'class':   'Account','function':'logout'}
		}).success(function(data, status, headers, config) {
			$location.path('/login');
			window.location.reload();
		}).error(function(data, status, headers, config) {
		});
	};
});