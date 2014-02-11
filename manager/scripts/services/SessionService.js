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
