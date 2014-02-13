/*! ews 2014-02-13 */
var app = angular.module('ews',
    [
        'ngRoute',
        'ngCookies',
        'ngStorage',
        'ngAnimate',
        'toaster',
        'ngTable',
        'http-auth-interceptor',
        'login',
        'main'
    ]);

app.config(['$httpProvider','$routeProvider',
    function($httpProvider, $routeProvider) {
        $routeProvider.
            // Faudrait mettre le cas ou on est pas loggé
            when('/dashboard', {
                templateUrl:        '../partials/dashboard.html',
                controller:         'DashboardController'
            }).
            when('/account/settings', {
                templateUrl:        '../partials/account/accountsettings.html',
                controller:         'AccountSettingController'
            }).
            when('/account/usersettings/:id', {
                templateUrl:        '../partials/account/usersettings.html',
                controller:         'UserSettingController'
            }).
            when('/clouds/instance/:id', {
                templateUrl:        '../partials/instance.html',
                controller:         'InstanceController'
            }).
            when('/register', {
                templateUrl:        '../partials/register.html',
                controller:         'RegisterController'
            }).
            otherwise({
                redirectTo:         '/dashboard'
            });
        }]
        );

app.directive('authApp', function($cookies, authService) {
    return {
        restrict: 'C',
        link: function(scope, elem, attrs) {
            //once Angular is started, remove class:
            elem.removeClass('wait-auth');
            
            var login = elem.find('#login-page');
            var main  = elem.find('#content-page');
            
            if ($cookies.session !== undefined) {
                authService.loginConfirmed();
                login.hide();
            } else {
                main.hide();
            }
            
            scope.$on('event:auth-loginRequired', function() {
                login.slideDown('slow', function() {
                    main.hide();
                });
            });
            scope.$on('event:auth-loginConfirmed', function() {
                main.show();
                login.slideUp();
            });
        }
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

app.controller('InstanceController', function($scope, $routeParams, $http, $location, $localStorage, $filter, ngTableParams) {
    $scope.currentUser = $localStorage.session;
    console.log($localStorage.testVMS);
    console.log("iiciicic");

    $http({
        url: 'api/modules/dispatcher.php',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { 'class':   'CloudsAjax','function':'instanceByCloudAccountId','data': {'id': $routeParams.id}}
    }).success(function(data, status, headers, config) {
        console.log(data);
        $localStorage.testVMS = data;
        $scope.cloudaccountname = data.cloudaccountname;
        $scope.cloudname        = data.cloudname;
        $scope.fileds           = data.fields;
        $scope.vms              = data.vms;
        switch (data.cloudname) {
            case 'AWS':
                $scope.title = "Amazon Web Services VM's";
                $scope.subtitle = "List AWS Vm's for account" + data.cloudaccountname;
                break;
            case 'EWS':
                $scope.title = "Eucalyptus VM's";
                $scope.subtitle = "List EWS Vm's for account" + data.cloudaccountname;
                break;
            case 'OWS':
                $scope.title = "OWS VM's";
                $scope.subtitle = "List OWS Vm's for account" + data.cloudaccountname;
                break;
        }

    }) .error(function(data, status, headers, config) {
        // SessionService.setUserAuthenticated(false);
    });

    var data = [{name: "Moroni", age: 50},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "toto", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "lolo", age: 29},
                {name: "titi", age: 34},
                {name: "Tiancum", age: 43},
                {name: "lol", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34}];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,           // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            var filteredData = params.filter() ?
                                $filter('filter')(data, $scope.searchText) :
                                data;
            var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) :
                                data;
                params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
});
var app = angular.module('login',['http-auth-interceptor']);

app.controller('LoginController', function($scope, $http, $location, $localStorage, $cookies, authService) {
    // pour instant le password est en clair, je me hacherai plus tard
    $scope.login = function(){
        $scope.data = {
            'class':   'Account',
            'function':'login',
            // 'data':    {'user_mail':'raphael.merrot@gmail.com', 'user_password':'cerise'}
            'data': {'user_mail': $scope.user_mail, 'user_password': $scope.user_password }
        };
        console.log($scope.data);

        $http({
            url: 'api/modules/dispatcher.php',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: $scope.data
        }).success(function(data, status, headers, config)
        {
            $localStorage.session = data.session;
            authService.loginConfirmed();
            console.log(data);
        })
        .error(function(data, status, headers, config)
        {
            // SessionService.setUserAuthenticated(false);
        });
    };
});
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

