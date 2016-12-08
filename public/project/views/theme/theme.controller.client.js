/**
 * Created by CherylRuo on 10/7/16.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("ThemeListController", ThemeListController)
        .controller("NewThemeController", NewThemeController)
        .controller("EditThemeController", EditThemeController);

    function ThemeListController($routeParams, ThemeService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var promise = ThemeService.findFollowedUsersByUserId(userId);
        promise.then(
            function(response){
                vm.followedUsers = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find followed users for this user."
            });
        var promise1 = ThemeService.findAllThemesForUser(userId);
        promise1.then(
            function(response){
                vm.themes = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find theme for this user."
            });
        vm.userId = userId;
    }

    function NewThemeController($location, $routeParams, ThemeService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var promise = ThemeService.findAllThemesForUser(userId);
        promise.then(
            function(response) {
                vm.themes = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find theme for this user."
            });
        vm.createTheme = createTheme;
        function createTheme(theme) {
            if(theme == null) {
                vm.alert = "Please create a theme.";
                return;
            }
            var promise = ThemeService.createTheme(vm.userId, theme);
            promise.then(
                function(response){
                    vm.theme = response.data;
                    $location.url("/user/"+ userId +"/theme");
                },
                function (httpError) {
                    vm.error = "Cannot create theme."
                });
        }
        vm.userId = userId;
    }

    function EditThemeController($location, $routeParams, ThemeService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var themeId = parseInt($routeParams.tid);

        var promise = ThemeService.findThemeById(themeId);
        promise.then(
            function(response){
                vm.theme = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find theme."
            });
        var promise1 = ThemeService.findAllThemesForUser(userId);
        promise1.then(
            function(response){
                vm.themes = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find theme for this user."
            });
        vm.updateTheme = updateTheme;
        vm.deleteTheme = deleteTheme;
        function updateTheme(updateTheme) {
            var promise = ThemeService.updateTheme(themeId, updateTheme);
            promise.then(
                function(response){
                    $location.url("/user/" + userId + "/theme");
                },
                function (httpError) {
                    vm.error = "Cannot update theme."
                });
        }
        function deleteTheme() {
            var promise = ThemeService.deleteTheme(themeId);
            promise.then(
                function(response){
                    $location.url("/user/" + userId + "/theme");
                },
                function (httpError) {
                    vm.error = "Cannot delete theme."
                });
        }
        vm.userId = userId;
        vm.themeId = themeId;
    }
})();