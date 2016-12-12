/**
 * Created by CherylRuo on 12/7/16.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("WalmartService", WalmartService);
    function WalmartService($http) {
        var key = "5eztdeaxny33uau6dkxvhweu";
        var urlBase = "http://api.walmartlabs.com/v1/search?apiKey=API_KEY&query=TEXT";
        var api = {
            searchWalmart   : searchWalmart
        };
        return api;

        function searchWalmart(searchTerm) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();