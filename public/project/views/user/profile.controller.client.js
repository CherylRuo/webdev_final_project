/**
 * Created by CherylRuo on 11/26/16.
 */
(function() {
    $('.datepicker').datepicker({
        format: 'mm/dd/yyyy',
        startDate: '-3d'
    });
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);
    function ProfileController($location, $rootScope, UserService) {
        var vm = this;
        vm.logout = logout;
        vm.updateUser = updateUser;
        vm.unregister = unregister;
        vm.userId = $rootScope.currentUser._id;
        var userId = vm.userId;
        var promise = UserService.findUserById(userId);
        promise.then(
            function (response) {
                vm.user = response.data;
            },
            function (httpError) {
                vm.error = "Error!";
            });
        function updateUser(updateUser) {
            var promise = UserService.updateUser(userId, updateUser);
            promise.then(
                function (response) {
                    $location.url("/user/" + userId);
                },
                function (httpError) {
                    vm.error = "Error!";
                });
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

        function unregister() {
            UserService
                .unregisterUser(vm.userId)
                .then(
                    function (response) {
                        // Take the user to login page on successful deletion
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function (httpError) {
                        // Display failure message
                        vm.deleteError = "Error! ";
                    }
                );
        }
    }
})();