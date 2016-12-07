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
        vm.updateUser = updateUser;
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

        vm.logout = logout;
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