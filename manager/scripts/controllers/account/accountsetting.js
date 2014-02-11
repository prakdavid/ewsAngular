var app = angular.module('ews');

app.controller('AccountSettingController', function($scope, $http, $location, $localStorage) {
	$scope.currentUser = $localStorage.session;
	console.log($scope.currentUser);

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
		accountname: $scope.currentUser.accountname,
		accountmail: $scope.currentUser.accountmail,
		account_type: $scope.accountType[$scope.currentUser.userrole]
	};

	// pour instant le password est en clair, je me hacherai plus tard
	$scope.edit = function(){
		$scope.data = {
			'class':   'Account',
			'function':'edit',
			'data': {'user_mail': $scope.user_mail, 'user_password': $scope.user_password }
		};
		console.log("edit");

	};
	$scope.delete = function(){
		console.log("delete");
	};
});