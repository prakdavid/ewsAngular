var app = angular.module('myApp', []);

app.run(function($rootScope) {
    $rootScope.name = "David";
    console.log("Hello");
});
