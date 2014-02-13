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