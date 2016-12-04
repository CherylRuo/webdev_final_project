/**
 * Created by CherylRuo on 10/7/16.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("SnatchService", SnatchService);
    function SnatchService($http) {
        var api = {
            createSnatch   : createSnatch,
            findAllSnatchsForTheme : findAllSnatchsForTheme,
            findSnatchById : findSnatchById,
            updateSnatch : updateSnatch,
            deleteSnatch : deleteSnatch
        };
        return api;

        function createSnatch(themeId, snatch) {
            return $http
                .post("/api/theme/" + themeId + "/snatch", snatch)
        }

        function findAllSnatchsForTheme(themeId) {
            return $http
                .get("/api/theme/" + themeId + "/snatch")
        }

        function findSnatchById(snatchId) {
            return $http
                .get("/api/snatch/"+ snatchId)
        }

        function updateSnatch(snatchId, snatch) {
            return $http
                .put("/api/snatch/" + snatchId, snatch)
        }

        function deleteSnatch(snatchId) {
            return $http
                .delete("/api/snatch/" + snatchId)
        }
    }
})();