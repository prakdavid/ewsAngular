/*! ews 2014-02-12 */
var app = angular.module('ews', ['ngRoute', 'ngCookies', 'ngStorage', 'ngAnimate', 'toaster']);
  
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
var app = angular.module('ews');

app.controller('UserSettingController', function($scope, $routeParams) {
    console.log($routeParams.id);
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

app.controller('SideMenuController', function($scope, $localStorage) {
    $scope.currentUser         = $localStorage.session;
    $scope.cloudaccountsbyname = $localStorage.cloudaccountsbyname;
    $scope.cloudaccountsbyid   = $localStorage.cloudaccountsbyid;
});
var app = angular.module('ews');

app.directive('sidemenu', function () {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/sidemenu/template.html',
      controller:  'SideMenuController',
      scope: {
        title: '@'
      }

    };
});
var app = angular.module('ews');

app.controller('testController', function($scope) {
    console.log("testController");
    console.log($scope);
     
});
var app = angular.module('ews');

app.directive('test', function () {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/test/template.html',
      controller:  'testController',
      scope: {
        title: '@'
      }

    };
});
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
			$location.path('/login');
			window.location.reload();
		}).error(function(data, status, headers, config) {
		});
	};
});
var app = angular.module('ews');

app.directive('topmenu', function () {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/topmenu/template.html',
      controller:  'TopMenuController',
      scope: {
        title: '@'
      }

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

