/**
 * Created by CherylRuo on 12/10/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("AdminController", AdminController);

    function AdminController(UserService, ThemeService, $rootScope, $route, $location) {
        var vm = this;
        vm.deleteUser = deleteUser;
        vm.deleteTheme = deleteTheme;
        vm.logout = logout;
        var currentUser = $rootScope.currentUser;
        vm.userId = currentUser._id;
        var promise = UserService.findAllUsers();
        promise.then(
            function (response) {
                vm.userlist = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find users."
            });
        var promise1 = ThemeService.findAllThemes();
        promise1.then(
            function (response) {
                vm.themelist = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find themes."
            });
        function deleteUser(userId) {
            UserService
                .unregisterUser(userId)
                .then(
                    function (response) {
                        $route.reload();
                    },
                    function (httpError) {
                        // Display failure message
                        vm.deleteError = "Error! ";
                    }
                );
        }
        function deleteTheme(themeId) {
            ThemeService
                .deleteTheme(themeId)
                .then(
                    function (response) {
                        $route.reload();
                    },
                    function (httpError) {
                        // Display failure message
                        vm.deleteError = "Error! ";
                    }
                );
        }
        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    });
        }

    }
})();