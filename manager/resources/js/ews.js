/*! ews 2014-02-11 */
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
var app = angular.module('ews');

app.controller('DashboardController', function($scope, $http) {
    // console.log("DashboardController");
    $scope.message = 'This is dashboard page';

    // Bon comme il y a absolument aucune facon de communiquer avec API avec ajax
    // donc fuat passer par CURL en PHP, ou bien faut que API authorise CORS
    $scope.data = {
        'class':   'Account',
        'function':'test',
        'data':    {'id':42, 'name':'David'}
    };

    // $http({
    //     url: 'api/modules/dispatcher.php',
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     data: $scope.data
    // }).success(function(data, status, headers, config)
    // {
    //     console.log(status + ' - ' + data);
    // })
    // .error(function(data, status, headers, config)
    // {
    //     console.log('error');
    // });
});
var app = angular.module('ews');

app.controller('LoginController', function($scope, $http, $location, $route, $localStorage, $cookies) {
    // pour instant le password est en clair, je me hacherai plus tard
    $scope.login = function(){
        $scope.data = {
            'class':   'Account',
            'function':'login',
            // 'data':    {'user_mail':'raphael.merrot@gmail.com', 'user_password':'cerise'}
            'data': {'user_mail': $scope.user_mail, 'user_password': $scope.user_password }
        };

        $http({
            url: 'api/modules/dispatcher.php',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: $scope.data
        }).success(function(data, status, headers, config)
        {
            $localStorage.session = data.session;
            $location.path('/dashboard');
            window.location.reload();
        })
        .error(function(data, status, headers, config)
        {
            // SessionService.setUserAuthenticated(false);
        });
    };
});
var app = angular.module('ews');

app.controller('MainCtrl', function($scope, $rootScope, $location, $route, $cookies, $http, $localStorage) {
	$scope.isUserLooged = ($cookies.session !== undefined) ? true : false;
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
var app = angular.module('ews');

app.controller('RegisterController', function($scope, $rootScope, $http, $location) {

    // pour instant le password est en clair, je me hacherai plus tard
    $scope.register = function(){
        console.log("RegisterController");
        
        $scope.data = {
            'class':   'Account',
            'function':'register',
            'data': {'user_mail': $scope.user_mail, 'user_password': $scope.user_password}
        };

        $http({
            url: 'api/modules/dispatcher.php',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: $scope.data
        }).success(function(data, status, headers, config)
        {
            console.log(status + ' - ' + data);
            $location.path('/');
        })
        .error(function(data, status, headers, config)
        {
            console.log(data, status, headers, config);
        });
    };
});
var app = angular.module('ews');

app.directive('breadcrumbs', function () {
    return {
      restrict: 'E',
      template: '<ul class="breadcrumb">'+
                    '<li ng-if="!title"><i class="fa fa-home"></i>Dashboard</a></li>'+
                    '<li ng-if="title"><i class="fa fa-home"></i><a href="/">Dashboard</a>'+
                    '</li>'+
                    '<li ng-if="title">{{title}}</li>'+
                '</ul>',
      scope: {
        title: '@'
      }
    };
});
var app = angular.module('ews');

app.controller('SideMenuController', function($scope) {
    console.log("SideMenuController");
     
});
var app = angular.module('ews');

app.directive('sidemenu', function () {
    return {
        restrict:    'E',
        templateUrl: 'app/scripts/directives/sidemenu/template.html',
        controller:  'SideMenuController'
    };
});
var app = angular.module('ews');
// Intercepteur HTTP
app.factory('IntercepteurHTTP', function ($q, $location) {
    return function (promise) {
        return promise.then(
        function (response) {
            return response; // ne rien faire si il n'a pas d'erreurs'
        },
        function (response) {
            // fonction qui sera executé si Angular reçoit une erreur http
            console.log(response.status, ">>> status");
            if (response.status === "401") { // on teste si c'est une erreur 401'
               $location.path('/'); // l'utilisateur sera redirigé vers la partie login
            }
            return $q.reject(response);
        }
        );
    };
});

var app = angular.module('ews');

app.service('SessionService', function(){
    var session = null;

    this.setSession = function(value) {
        session = value;
    };

    this.getSession = function() {
        return session;
    };
});
