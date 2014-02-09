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
               $location.path('/login'); // l'utilisateur sera redirigé vers la partie login
            }
            return $q.reject(response);
        }
        );
    };
});
