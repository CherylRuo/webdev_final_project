/**
 * Created by CherylRuo on 10/7/16.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("ThemeService", ThemeService);
    function ThemeService($http) {
        var api = {
            createTheme  : createTheme,
            findAllThemesForUser : findAllThemesForUser,
            findThemeById : findThemeById,
            updateTheme : updateTheme,
            deleteTheme : deleteTheme
        };
        return api;

        function createTheme(userId, theme) {
            return $http
                .post("/api/user/" + userId + "/theme", theme)
        }

        function findAllThemesForUser(userId) {
            return $http
                .get("/api/user/" + userId + "/theme")
        }

        function findThemeById(themeId) {
            return $http
                .get("/api/theme/" + themeId)
        }

        function updateTheme(themeId, theme) {
            return $http
                .put("/api/theme/" + themeId, theme)
        }

        function deleteTheme(themeId) {
            return $http
                .delete("/api/theme/" + themeId)
        }
    }
})();