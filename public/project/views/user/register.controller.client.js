/**
 * Created by CherylRuo on 11/26/16.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService, $rootScope) {
        var vm = this;
        vm.register = register;
        function register(user) {
            var promise = UserService.register(user);
            promise.then(
                function(response) {
                    var user = response.data;
                    $rootScope.currentUser = user;
                    $location.url("/user/"+user._id);
                },
                function (error) {
                    vm.error = "User already exists!";
                });
        }
    }
})();