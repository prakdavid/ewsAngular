var app = angular.module('ews');

app.controller('AccountSettingController', function($scope, $http, $location, $localStorage, toaster) {
	$scope.currentUser = $localStorage.session;

	$http({
		url: 'api/modules/dispatcher.php',
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		data: { 'class':   'Account','function':'getUserList'}
	}).success(function(data, status, headers, config) {
		$scope.userList = data.users;
	}) .error(function(data, status, headers, config) {
		// SessionService.setUserAuthenticated(false);
	});

	$scope.accountType = ['student','enterprise'];
	$scope.user = {
		account_name: $scope.currentUser.accountname,
		account_mail: $scope.currentUser.accountmail,
		account_type: $scope.accountType[$scope.currentUser.userrole]
	};

	// pour instant le password est en clair, je me hacherai plus tard
	$scope.edit = function(){
		$scope.data = {
			'class':   'Account',
			'function':'edit',
			'data': {
				'account_name': $scope.user.account_name,
				'account_mail': $scope.user.account_mail,
				'account_type': $scope.user.account_type
			}
		};
		$http({
			url: 'api/modules/dispatcher.php',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: $scope.data
		}).success(function(data, status, headers, config) {
			console.log(data);
			toaster.pop('success', "Account Edit", "Sucessed");
		}) .error(function(data, status, headers, config) {
			toaster.pop('error', "Account Edit", "Failed");
		});
	};
	$scope.delete = function(){
		$http({
			url: 'api/modules/dispatcher.php',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: { 'class':   'Account','function':'delete'}
		}).success(function(data, status, headers, config) {
			console.log(data);
			toaster.pop('success', "Delete Account", "Sucessed");
		}) .error(function(data, status, headers, config) {
			toaster.pop('error', "Delete Account", "Failed");
		});
	};
});