var app = angular.module('ews');

app.controller('UserSettingController', function($scope, $routeParams, $http, toaster) {
	console.log($routeParams.id);
	$scope.profil = {
		user_name: "toto",
		last_name: "Last Name",
		user_password: "test",
		confrim_password: "",
		user_mail: "toto@gmail.com",
	};
	$scope.edit = function(){
		$scope.data = {
			'class':   'Account',
			'function':'edit',
			'data': {
				'user_name':        $scope.profil.user_name,
				'last_name':        $scope.profil.last_name,
				'user_mail':        $scope.profil.user_mail,
				'user_password':    $scope.profil.user_password,
				'confrim_password': $scope.profil.confrim_password
			}
		};
		$http({
			url: 'api/modules/dispatcher.php',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: $scope.data
		}).success(function(data, status, headers, config) {
			console.log(data);
			toaster.pop('success', "Edit Profil", "Sucessed");
		}) .error(function(data, status, headers, config) {
			toaster.pop('error', "Edit Profil", "Failed");
		});
	};
});