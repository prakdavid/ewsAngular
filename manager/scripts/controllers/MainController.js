var app = angular.module('main', ['ngRoute', 'ngCookies', 'ngStorage', 'ngAnimate', 'toaster', 'ngTable']);

app.controller('MainController', function($scope, $location, $route, $cookies, $http, $localStorage) {
	$scope.isUserLooged = ($cookies.session !== undefined) ? true : false;


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
	// $scope.getStateVm();
});