var app = angular.module('ews');

app.controller('TopMenuController', function($scope, $http,  $location, $localStorage) {
	$scope.currentUser = $localStorage.session;
	 
	$scope.logout = function () {
		console.log("log out");
		$http({
			url: 'api/modules/dispatcher.php',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: { 'class':   'Account','function':'logout'}
		}).success(function(data, status, headers, config) {
			window.location.reload();
		}).error(function(data, status, headers, config) {
		});
	};
});