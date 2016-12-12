/**
 * Created by CherylRuo on 12/7/16.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("WalmartService", WalmartService);
    function WalmartService($http) {
        var api = {
            searchWalmart: searchWalmart
        };
        return api;
        function searchWalmart(searchTerm) {
            return $http.get("/api/walmartSearch/"+searchTerm);
        }
    }
})();